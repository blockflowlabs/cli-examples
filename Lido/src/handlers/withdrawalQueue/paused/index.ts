import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  IWithdrawalQueueConfig,
  WithdrawalQueueConfig,
} from "../../../types/schema";
import { _loadWithdrawalQueueConfigEntity } from "../../../helpers";

/**
 * @dev Event::Paused(uint256 duration)
 * @param context trigger object with contains {event: {duration }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PausedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Paused here

  const { event, transaction, block, log } = context;
  const { duration } = event;

  const withdrawalQueueConfigDB: Instance = bind(WithdrawalQueueConfig);

  let entity: IWithdrawalQueueConfig = await _loadWithdrawalQueueConfigEntity(
    withdrawalQueueConfigDB
  );

  entity.is_paused = true;
  entity.pause_duration = duration;

  await withdrawalQueueConfigDB.save(entity);
};
