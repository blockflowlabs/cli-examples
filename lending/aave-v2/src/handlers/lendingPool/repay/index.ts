import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Repay(address reserve, address user, address repayer, uint256 amount)
 * @param context trigger object with contains {event: {reserve ,user ,repayer ,amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const RepayHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Repay here

  const { event, transaction, block, log } = context;
  const { reserve, user, repayer, amount } = event;
};
