import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Transfer, ITransfer } from "../../types/schema";

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  const { from, to, value } = event;

  let transferDB: Instance = bind(Transfer);

  let transferId = `${transaction.transaction_hash}-${log.log_index}`;

  let transfer: ITransfer = await transferDB.findOne({
    id: transferId,
  });

  if (!transfer) {
    transfer = await transferDB.create({
      id: transferId,
      from: from.toString(),
      to: to.toString(),
      amount: value?.toString(),
    });
  }
};
