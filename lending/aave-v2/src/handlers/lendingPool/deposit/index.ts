import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Deposit(address reserve, address user, address onBehalfOf, uint256 amount, uint16 referral)
 * @param context trigger object with contains {event: {reserve ,user ,onBehalfOf ,amount ,referral }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Deposit here

  const { event, transaction, block, log } = context;
  const { reserve, user, onBehalfOf, amount, referral } = event;
};
