import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { EasyTrackConfig, IEasyTrackConfig } from "../../../types/schema";
import { _loadEasyTrackConfigEntity } from "../../../helpers";

/**
 * @dev Event::Unpaused(address account)
 * @param context trigger object with contains {event: {account }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UnpausedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Unpaused here

  const { event, transaction, block, log } = context;
  const { account } = event;

  const easyTrackConfigDB: Instance = bind(EasyTrackConfig);

  let entity: IEasyTrackConfig =
    await _loadEasyTrackConfigEntity(easyTrackConfigDB);

  entity.is_paused = false;

  await easyTrackConfigDB.save(entity);
};
