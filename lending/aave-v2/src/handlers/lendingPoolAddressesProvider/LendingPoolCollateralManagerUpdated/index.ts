import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::LendingPoolCollateralManagerUpdated(address newAddress)
 * @param context trigger object with contains {event: {newAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const LendingPoolCollateralManagerUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for LendingPoolCollateralManagerUpdated here

  const { event, transaction, block, log } = context;
  const { newAddress } = event;
};
