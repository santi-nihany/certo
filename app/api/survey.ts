import {
  sendTransaction,
  getContract,
  prepareContractCall,
  ThirdwebClient,
} from "thirdweb";
import { polygonAmoy } from "thirdweb/chains";
import { waitForReceipt } from "thirdweb";

const ADDRESS_AMOY_SURVEY = "0x...";

export const pushSurvey = async (
  client: ThirdwebClient,
  account: any,
  _totalPrize: any,
  _minResponses: any,
  _maxResponses: any,
  _expirationTime: any
) => {
  const contract = getContract({
    address: ADDRESS_AMOY_SURVEY,
    chain: polygonAmoy,
    client,
  });

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
    chain: polygonAmoy,
    transactionHash: transactionHash,
  });
};
