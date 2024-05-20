import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::NodeOperatorTotalKeysTrimmed(uint256 id, uint64 totalKeysTrimmed)
 * @param context trigger object with contains {event: {id ,totalKeysTrimmed }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorTotalKeysTrimmedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorTotalKeysTrimmed here

  const { event, transaction, block, log } = context;
  const { id, totalKeysTrimmed } = event;
};
