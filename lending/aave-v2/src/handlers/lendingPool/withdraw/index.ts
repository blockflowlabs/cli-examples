import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Withdraw(address reserve, address user, address to, uint256 amount)
 * @param context trigger object with contains {event: {reserve ,user ,to ,amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Withdraw here

  const { event, transaction, block, log } = context;
  const { reserve, user, to, amount } = event;
};
