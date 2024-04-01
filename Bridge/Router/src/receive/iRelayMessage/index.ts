import { IBind, Instance, IFunctionContext } from "@blockflow-labs/utils";

import {
  hexToString,
  chainToContract,
  stringToHex,
  getTokenInfo,
  hashDepositDataWithMessage,
} from "../../utils/helper";
import { Destination } from "../../types/schema";

/**
 * @dev Function::iRelayMessage(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const iRelayMessageHandler = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: Record<string, string>
) => {
  // Implement your function handler logic for iRelayMessage here
  const { functionParams, transaction, block } = context;
  const { relayData } = functionParams;

  const amount = relayData.amount.toString();
  const srcChain = hexToString(relayData.srcChainId.toString());
  const depositId = relayData.depositId.toString();
  const destToken = relayData.destToken.toString();
  const recipient = relayData.recipient.toString();
  const message = relayData.message.toString();

  const dstChain = block.chain_id;
  const transferDB: Instance = bind(Destination);
  const tokenInfo = getTokenInfo(dstChain, destToken);

  let messageHash = "0x";

  try {
    messageHash = hashDepositDataWithMessage({
      amount,
      srcChainId: stringToHex(srcChain),
      depositId,
      destToken,
      recipient,
      contract: chainToContract(dstChain),
      message,
    });
  } catch (error) {}

  const id = `${srcChain}_${dstChain}_${depositId}_${chainToContract(srcChain)}_${chainToContract(dstChain)}`; // messageHash.toLowerCase()

  await transferDB.create({
    id: id.toLowerCase(),
    blocktimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    transactionHash: transaction.transaction_hash,
    destnationtoken: {
      address: destToken,
      amount: amount,
      symbol: tokenInfo.symbol,
    },
    stableToken: {
      // @todo
      address: "",
      amount: "",
      symbol: "",
    },
    recipientAddress: transaction.transaction_to_address, // Contract from where txn came
    receiverAddress: recipient, // Who received the funds
    paidId: "", // FundsPaidWithMessageHandler
    forwarderAddress: transaction.transaction_from_address,
    messageHash: messageHash,
    execFlag: false, // FundsPaidWithMessageHandler
    execData: "", // FundsPaidWithMessageHandler
    usdValue: "", // @todo
  });
};
