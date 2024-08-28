import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniIncentive } from "../../types/schema";

/**
 * @dev Event::IncentiveEnded(bytes32 incentiveId, uint256 refund)
 * @param context trigger object with contains {event: {incentiveId ,refund }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const IncentiveEndedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for IncentiveEnded here

  const { event, transaction, block, log } = context;
  const { incentiveId, refund } = event;

  const incentiveDb = bind(UniIncentive);

  const incentive = await incentiveDb.findOne({ id: incentiveId });

  if (incentive) {
    incentive.ended = true;

    await incentiveDb.save(incentive);
  }
};
