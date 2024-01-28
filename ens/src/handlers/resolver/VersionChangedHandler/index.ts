import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::VersionChanged(bytes32 node, uint64 newVersion)
 * @param context trigger object with contains {event: {node ,newVersion }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const VersionChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for VersionChanged here

  const { event, transaction, block, log } = context;
  const { node, newVersion } = event;
};
