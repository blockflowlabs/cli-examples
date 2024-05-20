import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::NodeOperatorRewardAddressSet(uint256 id, address rewardAddress)
 * @param context trigger object with contains {event: {id ,rewardAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorRewardAddressSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorRewardAddressSet here

  const { event, transaction, block, log } = context;
  const { id, rewardAddress } = event;
};
