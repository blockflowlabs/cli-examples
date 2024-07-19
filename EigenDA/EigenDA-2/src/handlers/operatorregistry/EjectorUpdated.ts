import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::EjectorUpdated(address prevEjector, address newEjector)
 * @param context trigger object with contains {event: {prevEjector ,newEjector }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const EjectorUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for EjectorUpdated here

  const { event, transaction, block, log } = context;
  const { prevEjector, newEjector } = event;
};
