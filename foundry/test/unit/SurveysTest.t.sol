// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Surveys} from "../../src/Surveys.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {DeploySurveys} from "../../script/Deploy.s.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {ERC20Mock} from "../mocks/ERC20Mock.sol";

contract SurveysTest is Test {
    Surveys surveys;
    HelperConfig helperConfig;
    address usdc;
    uint256 deployerKey;

    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);

    address public user = address(1);

    uint256 public constant STARTING_USER_BALANCE = 500 ether;

    function setUp() external {
        DeploySurveys deployer = new DeploySurveys();
        (surveys, helperConfig) = deployer.run();
        (usdc, deployerKey) = helperConfig.activeNetworkConfig();
        if (block.chainid == 31_337) {
            vm.deal(user, STARTING_USER_BALANCE);
        }
        ERC20Mock(usdc).mint(owner, STARTING_USER_BALANCE);
        ERC20Mock(usdc).mint(user1, STARTING_USER_BALANCE);
        ERC20Mock(usdc).mint(user2, STARTING_USER_BALANCE);
    }

    function testCreateSurvey() public {
        vm.startPrank(owner);
        uint256 allowance = IERC20(usdc).allowance(owner, address(surveys));
        console.log("Allowance before approve: ", allowance);

        IERC20(usdc).approve(address(surveys), 100 ether);

        allowance = IERC20(usdc).allowance(owner, address(surveys));
        console.log("Allowance after approve: ", allowance);

        uint256 balance = IERC20(usdc).balanceOf(owner);
        console.log("Owner balance: ", balance);

        surveys.createSurvey(100 ether, 1, 10, block.timestamp + 1 days);

        (address creator,, uint256 expirationTime, uint256 totalPrize,,,) = surveys.s_surveys(1);
        assertEq(creator, owner);
        assertEq(expirationTime, block.timestamp + 1 days);
        console.log("Total prize: ", totalPrize);
        vm.stopPrank();
    }

    function testFailCreateSurveyWithInvalidTimestamp() public {
        vm.startPrank(owner);
        IERC20(usdc).approve(address(surveys), 100 ether);
        vm.expectRevert(Surveys.NeedsGreaterTimeStamp.selector);
        surveys.createSurvey(100 ether, 1, 10, block.timestamp - 1 days);
    }

    function testSubmitSurveyResponse() public {
        vm.startPrank(owner);
        IERC20(usdc).approve(address(surveys), 100 ether);
        surveys.createSurvey(100 ether, 1, 10, block.timestamp + 1 days);
        vm.stopPrank();

        vm.startPrank(user1);
        bytes32 proofOfHuman = keccak256(abi.encodePacked("human1"));
        bytes32 proofOfData = keccak256(abi.encodePacked("data1"));
        bytes32 ipfsCID = keccak256(abi.encodePacked("ipfs1"));
        bytes32 hashData = keccak256(abi.encodePacked("hash"));
        surveys.submitSurveyResponse(1, proofOfHuman, proofOfData, hashData, ipfsCID);
        assertEq(surveys.s_surveyResponders(1, proofOfHuman), user1);
    }

    // function testFailSubmitDuplicateSurveyResponse() public {
    //     vm.startPrank(owner);
    //     IERC20(usdc).approve(address(surveys), 100 ether);
    //     surveys.createSurvey(100 ether, 1, 10, block.timestamp + 1 days);
    //     vm.stopPrank();

    //     vm.startPrank(user1);
    //     bytes32 proofOfHuman = keccak256(abi.encodePacked("human1"));
    //     bytes32 proofOfData = keccak256(abi.encodePacked("data1"));
    //     bytes32 ipfsCID = keccak256(abi.encodePacked("ipfs1"));
    //     bytes32 hashData = keccak256(abi.encodePacked("hash"));
    //     surveys.submitSurveyResponse(1, proofOfHuman, proofOfData, hashData, ipfsCID);
    //     vm.expectRevert(abi.encodeWithSelector(Surveys.AlreadyResponded.selector));
    //     surveys.submitSurveyResponse(1, proofOfHuman, proofOfData, hashData, ipfsCID);
    // }

    function testWithdrawPrize() public {
        vm.startPrank(owner);
        IERC20(usdc).approve(address(surveys), 100 ether);
        surveys.createSurvey(100 ether, 1, 10, block.timestamp + 1 days);
        vm.stopPrank();

        vm.startPrank(user1);
        bytes32 proofOfHuman = keccak256(abi.encodePacked("human1"));
        bytes32 proofOfData = keccak256(abi.encodePacked("data1"));
        bytes32 ipfsCID = keccak256(abi.encodePacked("ipfs1"));
        bytes32 hashData = keccak256(abi.encodePacked("hash"));
        surveys.submitSurveyResponse(1, proofOfHuman, proofOfData, hashData, ipfsCID);
        vm.stopPrank();

        // Fast forward time
        vm.warp(block.timestamp + 2 days);

        vm.startPrank(user1);
        (uint256 prize, uint256 balance) = surveys.withdraw(1, proofOfHuman);
        console.log("Prize: ", prize);
        console.log("Balance: ", balance);
    }

    // function testFailWithdrawBeforeFinalization() public {
    //     vm.startPrank(owner);
    //     IERC20(usdc).approve(address(surveys), 100 ether);
    //     surveys.createSurvey(100 ether, 1, 10, block.timestamp + 1 days);
    //     vm.stopPrank();

    //     vm.startPrank(user1);
    //     bytes32 proofOfHuman = keccak256(abi.encodePacked("human1"));
    //     bytes32 proofOfData = keccak256(abi.encodePacked("data1"));
    //     bytes32 ipfsCID = keccak256(abi.encodePacked("ipfs1"));
    //     bytes32 dataHash = keccak256(abi.encodePacked("hash"));

    //     surveys.submitSurveyResponse(1, proofOfHuman, proofOfData, dataHash, ipfsCID);
    //     vm.stopPrank();

    //     // Attempt to withdraw before the survey is finalized
    //     vm.expectRevert(Surveys.SurveyIsNotFinalized.selector);
    //     surveys.withdraw(1, proofOfHuman);
    // }

    function testReclaimPrize() public {
        vm.startPrank(owner);
        IERC20(usdc).approve(address(surveys), 100 ether);
        surveys.createSurvey(100 ether, 2, 10, block.timestamp + 1 days);
        vm.stopPrank();

        // Fast forward time beyond expiration
        vm.warp(block.timestamp + 2 days);

        vm.startPrank(owner);
        surveys.reclaim(1);
    }
}
