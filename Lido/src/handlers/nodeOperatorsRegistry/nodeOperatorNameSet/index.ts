import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::NodeOperatorNameSet(uint256 id, string name)
 * @param context trigger object with contains {event: {id ,name }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorNameSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorNameSet here

  const { event, transaction, block, log } = context;
  const { id, name } = event;
};
