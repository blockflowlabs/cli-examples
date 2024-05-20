import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::NodeOperatorStakingLimitSet(uint256 id, uint64 stakingLimit)
 * @param context trigger object with contains {event: {id ,stakingLimit }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorStakingLimitSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorStakingLimitSet here

  const { event, transaction, block, log } = context;
  const { id, stakingLimit } = event;
};
