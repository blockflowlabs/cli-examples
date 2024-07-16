import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::MinimumStakeForQuorumUpdated(uint8 quorumNumber, uint96 minimumStake)
 * @param context trigger object with contains {event: {quorumNumber ,minimumStake }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MinimumStakeForQuorumUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for MinimumStakeForQuorumUpdated here

  const { event, transaction, block, log } = context;
  const { quorumNumber, minimumStake } = event;
};
