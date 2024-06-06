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
 * @dev Event::BunkerModeEnabled(uint256 _sinceTimestamp)
 * @param context trigger object with contains {event: {_sinceTimestamp }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BunkerModeEnabledHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BunkerModeEnabled here

  const { event, transaction, block, log } = context;
  const { _sinceTimestamp } = event;

  const withdrawalQueueConfigDB: Instance = bind(WithdrawalQueueConfig);

  let entity: IWithdrawalQueueConfig = await _loadWithdrawalQueueConfigEntity(
    withdrawalQueueConfigDB,
  );

  entity.is_bunker_mode = true;

  entity.bunker_mode_since = _sinceTimestamp;

  await withdrawalQueueConfigDB.save(entity);
};
