import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Initialized(uint8 version)
 * @param context trigger object with contains {event: {version }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const InitializedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Initialized here

  const { event, transaction, block, log } = context;
  const { version } = event;
};
