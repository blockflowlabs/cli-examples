import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

/**
 * @dev Event::BeaconUpgraded(address beacon)
 * @param context trigger object with contains {event: {beacon }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BeaconUpgradedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BeaconUpgraded here

  const { event, transaction, block, log } = context
  const { beacon } = event
}
