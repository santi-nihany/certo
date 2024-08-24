// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title A Survey Contract for creating and responding to surveys with USDC compensation
/// @author Certo
/// @notice This contract allows users to create surveys, deposit USDC as prizes, and reward respondents
/// @dev This contract uses Chainlink price feeds to convert USD amounts into USDC

contract Surveys is ReentrancyGuard {
    //////////////
    // Errors ////
    //////////////

    /// @notice Thrown when an amount is required to be greater than zero
    error NeedsMoreThanZero();

    /// @notice Thrown when the max responses are less than the min responses
    error MaxShouldBeGreaterThanMin();

    /// @notice Thrown when the expiration time is not in the future
    error NeedsGreaterTimeStamp();

    /// @notice Thrown when a USDC transfer fails
    error TransferFailed();

    /// @notice Thrown when the survey is not active
    error SurveyIsNotActive();

    /// @notice Thrown when the survey is not finalized
    error SurveyIsNotFinalized();

    /// @notice Thrown when a required bytes parameter is not provided
    error BytesNotProvided();

    /// @notice Thrown when a user has already responded to a survey
    error AlreadyResponded();

    /// @notice Thrown when a user is not the responder they claim to be
    error NotAResponder();

    /// @notice Thrown when a user is not the creator of the survey
    error NotCreator();

    /// @notice Thrown when the proof of human is invalid
    error InvalidProofOfHuman();

    /// @notice Thrown when the proof of data is invalid
    error InvalidProofOfData();

    //////////////
    // Events ////
    //////////////

    /// @notice Emitted when a survey is created
    /// @param surveyId The ID of the created survey
    /// @param creator The address of the survey creator
    /// @param totalPrize The total prize amount in USDC for the survey
    /// @param minResponses The minimum number of responses required for the survey to be valid
    /// @param maxResponses The maximum number of responses allowed for the survey
    /// @param expirationTime The time after which the survey will expire
    event SurveyCreated(
        uint256 indexed surveyId,
        address indexed creator,
        uint256 totalPrize,
        uint256 minResponses,
        uint256 maxResponses,
        uint256 expirationTime
    );

    /// @notice Emitted when a survey response is submitted
    /// @param surveyId The ID of the survey being responded to
    /// @param responder The address of the responder
    /// @param proofOfHuman A unique proof provided by the responder
    /// @param proofOfData A unique proof for the data provided in the response
    /// @param dataHash The hashed version of the survey answer
    /// @param ipfsCID The IPFS CID where the response data is stored
    event SurveyResponse(
        uint256 indexed surveyId,
        address indexed responder,
        bytes32 proofOfHuman,
        bytes32 proofOfData,
        bytes32 dataHash,
        bytes32 ipfsCID
    );

    ////////////////
    /// Types /////
    //////////////

    /// @notice Enum representing the state of a survey
    enum State {
        Active,
        Finalized,
        Reverted
    }

    /// @notice Struct representing a survey
    /// @param creator The address of the survey creator
    /// @param creationTime The timestamp when the survey was created
    /// @param expirationTime The timestamp when the survey will expire
    /// @param totalPrize The total prize amount in USDC for the survey
    /// @param minResponses The minimum number of responses required for the survey to be valid
    /// @param maxResponses The maximum number of responses allowed for the survey
    /// @param totalResponses The total number of responses received so far
    struct Survey {
        address creator;
        uint256 creationTime;
        uint256 expirationTime;
        uint256 totalPrize;
        uint256 minResponses;
        uint256 maxResponses;
        uint256 totalResponses;
    }

    ////////////////
    // State Vars //
    //////////////

    uint256 private constant PRECISION = 1e18;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;
    uint256 private constant FEED_PRECISION = 1e8;

    uint256 public s_surveyCounter;
    mapping(uint256 => Survey) public s_surveys;
    mapping(uint256 => mapping(bytes32 => address)) public s_surveyResponders;
    address public immutable s_usdcPriceFeed;
    address public immutable s_usdcToken;

    /// @notice Initializes the Surveys contract with the USDC token and Chainlink price feed addresses
    /// @param token The address of the USDC token contract
    /// @param _priceFeed The address of the Chainlink price feed for USDC/USD
    constructor(address token, address _priceFeed) {
        s_surveyCounter = 0;
        s_usdcPriceFeed = _priceFeed;
        s_usdcToken = token;
    }

    // modifiers
    modifier moreThanZero(uint256 _amount) {
        if (_amount <= 0) {
            revert NeedsMoreThanZero();
        }
        _;
    }

    modifier bytesProvided(bytes32 _bytes) {
        if (_bytes == 0) {
            revert BytesNotProvided();
        }
        _;
    }

    modifier surveyIsActive(uint256 _surveyId) {
        if (_getCurrentState(_surveyId) != State.Active) {
            revert SurveyIsNotActive();
        }
        _;
    }

    modifier surveyIsFinalized(uint256 _surveyId) {
        if (_getCurrentState(_surveyId) != State.Finalized) {
            revert SurveyIsNotFinalized();
        }
        _;
    }

    modifier surveyIsReverted(uint256 _surveyId) {
        if (_getCurrentState(_surveyId) != State.Reverted) {
            revert SurveyIsNotFinalized();
        }
        _;
    }

    modifier hasNotResponded(uint256 _surveyId, bytes32 _proofOfHuman) {
        if (s_surveyResponders[_surveyId][_proofOfHuman] != address(0)) {
            revert AlreadyResponded();
        }
        _;
    }

    modifier isResponder(uint256 _surveyId, bytes32 _proofOfHuman) {
        if (s_surveyResponders[_surveyId][_proofOfHuman] != msg.sender) {
            revert NotAResponder();
        }
        _;
    }

    modifier isCreator(address _creator) {
        if (msg.sender != _creator) {
            revert NotCreator();
        }
        _;
    }

    // ----- Functions -------

    /// @notice Creates a new survey with the specified parameters
    /// @dev Transfers the specified USDC amount to the contract and emits a SurveyCreated event
    /// @param _totalPrize The total prize amount in USD (will be converted to USDC)
    /// @param _minResponses The minimum number of responses required for the survey
    /// @param _maxResponses The maximum number of responses allowed for the survey
    /// @param _expirationTime The timestamp when the survey will expire (in seconds since epoch)
    function createSurvey(uint256 _totalPrize, uint256 _minResponses, uint256 _maxResponses, uint256 _expirationTime)
        external
        moreThanZero(_totalPrize)
        moreThanZero(_minResponses)
    {
        if (_maxResponses < _minResponses) {
            revert MaxShouldBeGreaterThanMin();
        }
        if (_expirationTime <= block.timestamp) {
            revert NeedsGreaterTimeStamp();
        }
        s_surveyCounter++;
        s_surveys[s_surveyCounter] =
            Survey(msg.sender, block.timestamp, _expirationTime, _totalPrize, _minResponses, _maxResponses, 0);
        uint256 usdcAmount = _getTokenAmountFromUsd(_totalPrize * PRECISION);
        bool success = IERC20(s_usdcToken).transferFrom(msg.sender, address(this), usdcAmount);
        if (!success) {
            revert TransferFailed();
        }
        emit SurveyCreated(s_surveyCounter, msg.sender, _totalPrize, _minResponses, _maxResponses, _expirationTime);
    }

    /// @notice Submits a response to a survey
    /// @dev Verifies the proof of human and proof of data, then records the response
    /// @param surveyId The ID of the survey being responded to
    /// @param _proofOfHuman A unique proof provided by the responder
    /// @param _proofOfData A unique proof for the data provided in the response
    /// @param ipfsCID The IPFS CID where the response data is stored
    function submitSurveyResponse(
        uint256 surveyId,
        bytes32 _proofOfHuman,
        bytes32 _proofOfData,
        bytes32 _dataHash,
        bytes32 ipfsCID
    )
        external
        surveyIsActive(surveyId)
        hasNotResponded(surveyId, _proofOfHuman)
        bytesProvided(_proofOfHuman)
        bytesProvided(_proofOfData)
        bytesProvided(ipfsCID)
    {
        if (!_verifyHuman(_proofOfHuman)) {
            revert InvalidProofOfHuman();
        }
        if (!_verifyData(_proofOfData, _dataHash)) {
            revert InvalidProofOfData();
        }
        s_surveys[surveyId].totalResponses++;
        s_surveyResponders[surveyId][_proofOfHuman] = msg.sender;
        emit SurveyResponse(surveyId, msg.sender, _proofOfHuman, _proofOfData, _dataHash, ipfsCID);
    }

    /// @notice Withdraws the responder's share of the prize from a finalized survey
    /// @dev The prize is divided equally among all valid responses
    /// @param _surveyId The ID of the survey to withdraw from
    /// @param _proofOfHuman The proof provided by the responder
    function withdraw(uint256 _surveyId, bytes32 _proofOfHuman)
        external
        surveyIsFinalized(_surveyId)
        isResponder(_surveyId, _proofOfHuman)
        nonReentrant
    {
        // Divide the total prize by the number of responders
        uint256 prize = s_surveys[_surveyId].totalPrize / s_surveys[_surveyId].totalResponses;
        // Transfer the amount to the responder
        bool success = IERC20(s_usdcToken).transfer(msg.sender, prize);
        if (!success) {
            revert TransferFailed();
        }
    }

    /// @notice Allows the survey creator to reclaim the prize if the survey is reverted
    /// @dev This function can only be called if the survey did not receive enough responses
    /// @param _surveyId The ID of the survey to reclaim from
    function reclaim(uint256 _surveyId) external surveyIsReverted(_surveyId) isCreator(msg.sender) nonReentrant {
        // Transfer the amount to the creator
        bool success = IERC20(s_usdcToken).transfer(msg.sender, s_surveys[_surveyId].totalPrize);
        if (!success) {
            revert TransferFailed();
        }
    }

    // internals private

    /// @notice Converts a USD amount (in Wei) to the equivalent USDC amount
    /// @dev Uses Chainlink price feeds to get the current USD/USDC exchange rate
    /// @param usdAmountInWei The amount in USD (in Wei) to convert
    /// @return The equivalent amount in USDC
    function _getTokenAmountFromUsd(uint256 usdAmountInWei) internal view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(s_usdcPriceFeed);
        (, int256 price,,,) = priceFeed.latestRoundData();
        // $100e18 USD
        // 1 ETH = 2000 USD
        // The returned value from Chainlink will be 2000 * 1e8
        // Most USD pairs have 8 decimals, so we will just pretend they all do
        return ((usdAmountInWei * PRECISION) / (uint256(price) * ADDITIONAL_FEED_PRECISION));
    }

    /// @notice Determines the current state of a survey
    /// @param _surveyId The ID of the survey to check
    /// @return The current state of the survey (Active, Finalized, or Reverted)
    function _getCurrentState(uint256 _surveyId) internal view returns (State) {
        if (
            (s_surveys[_surveyId].expirationTime < block.timestamp)
                || (s_surveys[_surveyId].totalResponses == s_surveys[_surveyId].maxResponses)
        ) {
            if (s_surveys[_surveyId].totalResponses < s_surveys[_surveyId].minResponses) {
                return State.Reverted;
            }
            return State.Finalized;
        }
        return State.Active;
    }

    function _verifyHuman(bytes32 _proofOfHuman) internal returns (bool) {
        // TODO implement
        return true;
    }

    function _verifyData(bytes32 _proofOfData, bytes32 dataHash) internal returns (bool) {
        // TODO implement
        return true;
    }
}
