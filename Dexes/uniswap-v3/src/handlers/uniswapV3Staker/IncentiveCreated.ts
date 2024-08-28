import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniIncentive, IUniIncentive } from "../../types/schema";
import { getIncentiveId } from "../../utils/helper";

/**
 * @dev Event::IncentiveCreated(address rewardToken, address pool, uint256 startTime, uint256 endTime, address refundee, uint256 reward)
 * @param context trigger object with contains {event: {rewardToken ,pool ,startTime ,endTime ,refundee ,reward }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const IncentiveCreatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for IncentiveCreated here

  const { event, transaction, block, log } = context;
  const { rewardToken, pool, startTime, endTime, refundee, reward } = event;

  const incentiveDb: Instance = bind(UniIncentive);

  const incentiveTuple = [
    rewardToken,
    pool,
    Number(startTime),
    Number(endTime),
    refundee,
  ];

  const incentiveId = getIncentiveId(incentiveTuple);

  let incentive: IUniIncentive = await incentiveDb.findOne({ id: incentiveId });

  if (!incentive) {
    await incentiveDb.create({
      id: incentiveId,
      rewardToken: rewardToken.toLowerCase(),
      pool: pool.toLowerCase(),
      startTime: Number(startTime),
      endTime: Number(endTime),
      refundee: refundee.toLowerCase(),
      reward: Number(reward),
      ended: false,
    });
  } else {
    incentive.rewardToken = rewardToken.toLowerCase();
    incentive.pool = pool.toLowerCase();
    incentive.startTime = Number(startTime);
    incentive.endTime = Number(endTime);
    incentive.refundee = refundee.toLowerCase();
    incentive.reward = Number(reward);
    incentive.ended = false;

    await incentiveDb.save(incentive);
  }
};
