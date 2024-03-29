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
} from "../../utils/helper";
import { Destination, IDestination } from "../../types/schema";

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

  const id = `${srcChain}_${dstChain}_${depositId}`;
  // messageHash

  await transferDB.create({
    id: id.toLowerCase(),
    blocktimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    transactionHash: transaction.transaction_hash,
    destnationtoken: {
      address: destToken,
      amount: amount,
      symbol: "XOXO",
    },
    stableToken: {
      address: "",
      amount: "",
      symbol: "",
    },
    recipientAddress: transaction.transaction_to_address, // Contract from where txn came
    receiverAddress: recipient, // Who received the funds
    paidId: "", // can get this from event
    forwarderAddress: transaction.transaction_from_address,
    messageHash: messageHash,
    execFlag: false,
    execData: "",
    usdValue: "",
  });
};
