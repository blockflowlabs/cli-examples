import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IMotion, IObjection, Motion, Objection } from "../../../types/schema";

/**
 * @dev Event::MotionObjected(uint256 _motionId, address _objector, uint256 _weight, uint256 _newObjectionsAmount, uint256 _newObjectionsAmountPct)
 * @param context trigger object with contains {event: {_motionId ,_objector ,_weight ,_newObjectionsAmount ,_newObjectionsAmountPct }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MotionObjectedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for MotionObjected here

  const { event, transaction, block, log } = context;
  const {
    _motionId,
    _objector,
    _weight,
    _newObjectionsAmount,
    _newObjectionsAmountPct,
  } = event;

  const motionDB: Instance = bind(Motion);

  let motionEntity: IMotion = await motionDB.findOne({
    id: _motionId.toString(),
  });

  if (!motionEntity) {
    motionEntity = await motionDB.create({
      id: _motionId.toString(),
    });
  }

  motionEntity.objections_amount = _newObjectionsAmount;

  motionEntity.objections_amount_pct = _newObjectionsAmountPct;

  await motionDB.save(motionEntity);

  const objectionDB: Instance = bind(Objection);

  let objectionEntityId = `${_objector}:${_motionId}`.toString();

  let objectionEntity: IObjection = await objectionDB.findOne({
    id: objectionEntityId,
  });

  if (!objectionEntity) {
    objectionEntity = await objectionDB.create({
      id: objectionEntityId,
    });

    objectionEntity.objector = _objector.toString();
    objectionEntity.motionId = _motionId.toString();
    objectionEntity.weight = _weight;

    objectionEntity.motion = motionEntity.id.toString();
    objectionEntity.block_timestamp = block.block_timestamp;
    objectionEntity.transaction_hash = transaction.transaction_hash;
    objectionEntity.log_index = log.log_index;
  }

  await objectionDB.save(objectionEntity);
};
