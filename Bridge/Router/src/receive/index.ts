import {
  IBind,
  Instance,
  ISecrets,
  IFunctionContext,
} from "@blockflow-labs/utils";

import { hexToString } from "../utils/helper";
import { CrossTransferDst } from "../types/schema";

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
  const transferDB: Instance = bind(CrossTransferDst);

  const transferId = `${depositId}_${srcChain}_${dstChain}`;

  await transferDB.create({
    id: transferId.toLowerCase(),
    depositId,
    destToken,
    dstAmount: amount,
    srcChain,
    dstTxHash: transaction.transaction_hash,
    dstTxTime: block.block_timestamp,
    dstTxStatus: transaction.transaction_receipt_status,
    dstChain,
    recipient,
  });
};
