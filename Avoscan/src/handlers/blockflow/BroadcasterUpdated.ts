import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::BroadcasterUpdated(address broadcaster, bool status)
 * @param context trigger object with contains {event: {broadcaster ,status }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BroadcasterUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BroadcasterUpdated here

  const { event, transaction, block, log } = context;
  const { broadcaster, status } = event;
};
