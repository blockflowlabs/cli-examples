import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { EasyTrackConfig, IEasyTrackConfig } from "../../../types/schema";
import { _loadEasyTrackConfigEntity } from "../../../helpers";

/**
 * @dev Event::MotionDurationChanged(uint256 _motionDuration)
 * @param context trigger object with contains {event: {_motionDuration }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MotionDurationChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for MotionDurationChanged here

  const { event, transaction, block, log } = context;
  const { _motionDuration } = event;

  const easyTrackConfigDB: Instance = bind(EasyTrackConfig);

  let entity: IEasyTrackConfig =
    await _loadEasyTrackConfigEntity(easyTrackConfigDB);

  entity.motion_duration = _motionDuration;

  await easyTrackConfigDB.save(entity);
};
