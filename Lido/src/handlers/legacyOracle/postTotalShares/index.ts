import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::PostTotalShares(uint256 postTotalPooledEther, uint256 preTotalPooledEther, uint256 timeElapsed, uint256 totalShares)
 * @param context trigger object with contains {event: {postTotalPooledEther ,preTotalPooledEther ,timeElapsed ,totalShares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PostTotalSharesHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for PostTotalShares here

  const { event, transaction, block, log } = context;
  const {
    postTotalPooledEther,
    preTotalPooledEther,
    timeElapsed,
    totalShares,
  } = event;
};
