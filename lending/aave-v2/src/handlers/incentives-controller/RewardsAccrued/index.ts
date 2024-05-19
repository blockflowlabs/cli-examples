import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { IncentivizedAction } from "../../../types/schema";

/**
 * @dev Event::RewardsAccrued(address user, uint256 amount)
 * @param context trigger object with contains {event: {user ,amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const RewardsAccruedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for RewardsAccrued here

  const { event, transaction, block, log } = context;
  const { user, amount } = event;

  let incentivizedActionDB = bind(IncentivizedAction);
  let incentivizedActionID =
    block.block_number.toString() +
    ":" +
    transaction.transaction_index.toString() +
    ":" +
    transaction.transaction_hash.toString() +
    ":" +
    log.log_index.toString() +
    ":" +
    log.log_transaction_index.toString();

  await incentivizedActionDB.create({
    id: incentivizedActionID,
    incentivesController: event.address.toString(),
    user: user.toString(),
    amount: amount.toString(),
  });
};
