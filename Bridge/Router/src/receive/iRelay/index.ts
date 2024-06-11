import {
  IBind,
  Instance,
  ISecrets,
  IFunctionContext,
} from "@blockflow-labs/utils";

import {
  hexToString,
  chainToContract,
  hashDepositData,
  stringToHex,
  getTokenInfo,
  getNetworkName,
} from "../../utils/helper";
import { Destination, TokensInfo } from "../../types/schema";
import { fetchTokenInfo } from "../../utils/node";

/**
 * @dev Function::iRelay(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const iRelayHandler = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your function handler logic for iRelay here
  const { functionParams, transaction, block } = context;
  const { relayData } = functionParams;

  const amount = relayData.amount.toString();
  const srcChain = hexToString(relayData.srcChainId.toString());
  const depositId = relayData.depositId.toString();
  const destToken = relayData.destToken.toString();
  const recipient = relayData.recipient.toString();

  const dstChain = block.chain_id;
  const transferDB: Instance = bind(Destination);
  const tokendb: Instance = bind(TokensInfo);

  // from database @mayank
  // timestamp - Date.now() = fetch it from apis and update it in the db

  const token = await tokendb.findOne({
    id: `${dstChain}_${destToken}`.toLowerCase(),
  });

  if (!token) {
    // @mayank
    const info = await fetchTokenInfo(destToken, getNetworkName(dstChain));

    token.decimals = info.decimals;
    token.name = info.name;
    token.symbol = info.symbol;

    await tokendb.save(token);
  }

  const tokenInfo = getTokenInfo(dstChain, destToken);

  let messageHash = "0x";

  try {
    messageHash = hashDepositData({
      amount,
      srcChainId: stringToHex(srcChain),
      depositId,
      destToken,
      recipient,
      contract: chainToContract(dstChain),
    });
  } catch (error) {}

  let tokenPath = {
    destnationtoken: {
      address: destToken,
      amount: amount,
      symbol: tokenInfo.symbol,
    },
    stableToken: {
      address: destToken,
      amount: amount,
      symbol: tokenInfo.symbol,
    },
  };

  const id = `${srcChain}_${dstChain}_${depositId}_${chainToContract(srcChain)}_${chainToContract(dstChain)}`; // messageHash.toLowerCase()

  await transferDB.create({
    id: id.toLowerCase(),
    blocktimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    transactionHash: transaction.transaction_hash,
    destnationtoken: tokenPath.destnationtoken,
    stableToken: tokenPath.stableToken,
    recipientAddress: transaction.transaction_to_address, // Contract from where txn came
    receiverAddress: recipient, // Who received the funds
    paidId: "", // can get this from event
    forwarderAddress: transaction.transaction_from_address,
    messageHash: messageHash,
    execFlag: false, // only for fund
    execData: "", //
    usdValue: "",
  });
};
