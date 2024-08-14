import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Transfer, ITransfer } from "../../types/schema";

import { convertToString } from "../../utils";

/**
 * @dev Event::Transfer(address from, address to, uint256 amount)
 * @param context trigger object with contains {event: {from ,to ,amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  const { from, to, amount } = event;

  let transferDB: Instance = bind(Transfer);

  let transferId = convertToString(
    `${transaction.transaction_hash}-${log.log_index}`
  );

  let transfer: ITransfer = await transferDB.findOne({
    id: transferId,
  });

  if (!transfer) {
    transfer = await transferDB.create({
      id: transferId,
      from: convertToString(from),
      to: convertToString(to),
      amount: amount.toString(),
      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
    });
  }
};
