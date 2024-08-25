import {
  sendTransaction,
  getContract,
  prepareContractCall,
  ThirdwebClient,
} from "thirdweb";
import { polygon } from "thirdweb/chains";
import { waitForReceipt } from "thirdweb";
import { abi } from "@/foundry/out/Surveys.sol/Surveys.json";

const ADDRESS_POLYGON_SURVEY = "0x077d54488c525a5abeea077589a31c3eb675555e";
const ADDRESS_POLYGON_USDC = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

export const createSurvey = async (
  client: ThirdwebClient,
  account: any,
  _totalPrize: any,
  _minResponses: any,
  _maxResponses: any,
  _expirationTime: any
) => {
  const contract = getContract({
    address: ADDRESS_POLYGON_SURVEY,
    chain: polygon,
    client,
  });

  console.log("prize", _totalPrize);
  const transaction = prepareContractCall({
    contract,
    method:
      "function createSurvey(uint256 _totalPrize, uint256 _minResponses, uint256 _maxResponses, uint256 _expirationTime)",
    params: [_totalPrize, _minResponses, _maxResponses, _expirationTime],
  });

  const { transactionHash } = await sendTransaction({
    account,
    transaction,
  });

  const receipt = await waitForReceipt({
    client,
    chain: polygon,
    transactionHash: transactionHash,
  });
  return receipt;
};

export const approveUSDC = async (
  client: ThirdwebClient,
  account: any,
  _totalPrize: any
) => {
  const contract = getContract({
    address: ADDRESS_POLYGON_USDC,
    chain: polygon,
    client,
  });

  const transaction = prepareContractCall({
    contract,
    method: "function approve(address spender, uint256 amount)",
    params: [ADDRESS_POLYGON_SURVEY, _totalPrize],
  });

  const { transactionHash } = await sendTransaction({
    account,
    transaction,
  });

  const receipt = await waitForReceipt({
    client,
    chain: polygon,
    transactionHash: transactionHash,
  });
  return receipt;
};
