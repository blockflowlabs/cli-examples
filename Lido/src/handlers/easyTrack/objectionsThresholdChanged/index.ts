import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { EasyTrackConfig, IEasyTrackConfig } from "../../../types/schema";
import { _loadEasyTrackConfigEntity } from "../../../helpers";

/**
 * @dev Event::ObjectionsThresholdChanged(uint256 _newThreshold)
 * @param context trigger object with contains {event: {_newThreshold }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ObjectionsThresholdChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for ObjectionsThresholdChanged here

  const { event, transaction, block, log } = context;
  const { _newThreshold } = event;

  const easyTrackConfigDB: Instance = bind(EasyTrackConfig);

  let entity: IEasyTrackConfig =
    await _loadEasyTrackConfigEntity(easyTrackConfigDB);

  entity.objections_threshold = _newThreshold;

  await easyTrackConfigDB.save(entity);
};
