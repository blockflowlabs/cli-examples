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
import { ZERO } from "../../../constants";

/**
 * @dev Event::Resumed()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ResumedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Resumed here

  const { event, transaction, block, log } = context;
  const {} = event;

  const withdrawalQueueConfigDB: Instance = bind(WithdrawalQueueConfig);

  let entity: IWithdrawalQueueConfig = await _loadWithdrawalQueueConfigEntity(
    withdrawalQueueConfigDB
  );

  entity.is_paused = false;

  entity.pause_duration = Number(ZERO);

  await withdrawalQueueConfigDB.save(entity);
};
