import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::NodeOperatorTotalStoppedValidatorsReported(uint256 id, uint64 totalStopped)
 * @param context trigger object with contains {event: {id ,totalStopped }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorTotalStoppedValidatorsReportedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorTotalStoppedValidatorsReported here

  const { event, transaction, block, log } = context;
  const { id, totalStopped } = event;
};
