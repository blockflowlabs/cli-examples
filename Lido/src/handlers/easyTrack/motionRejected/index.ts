import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IMotion, Motion } from "../../../types/schema";

/**
 * @dev Event::MotionRejected(uint256 _motionId)
 * @param context trigger object with contains {event: {_motionId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MotionRejectedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for MotionRejected here

  const { event, transaction, block, log } = context;
  const { _motionId } = event;

  const motionDB: Instance = bind(Motion);

  let motionEntity: IMotion = await motionDB.findOne({
    id: _motionId.toString(),
  });

  if (!motionEntity) {
    motionEntity = await motionDB.create({
      id: _motionId.toString(),
    });
  }

  motionEntity.status = "REJECTED";
  motionEntity.rejected_at = block.block_timestamp;

  await motionDB.save(motionEntity);
};
