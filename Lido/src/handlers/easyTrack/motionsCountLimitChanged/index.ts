import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { EasyTrackConfig, IEasyTrackConfig } from "../../../types/schema";
import { _loadEasyTrackConfigEntity } from "../../../helpers";

/**
 * @dev Event::MotionsCountLimitChanged(uint256 _newMotionsCountLimit)
 * @param context trigger object with contains {event: {_newMotionsCountLimit }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MotionsCountLimitChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for MotionsCountLimitChanged here

  const { event, transaction, block, log } = context;
  const { _newMotionsCountLimit } = event;

  const easyTrackConfigDB: Instance = bind(EasyTrackConfig);

  let entity: IEasyTrackConfig =
    await _loadEasyTrackConfigEntity(easyTrackConfigDB);

  entity.motions_count_limit = _newMotionsCountLimit;

  await easyTrackConfigDB.save(entity);
};
