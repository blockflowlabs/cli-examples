import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::BatchConfirmerStatusChanged(address batchConfirmer, bool status)
 * @param context trigger object with contains {event: {batchConfirmer ,status }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BatchConfirmerStatusChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BatchConfirmerStatusChanged here

  const { event, transaction, block, log } = context;
  const { batchConfirmer, status } = event;
};
