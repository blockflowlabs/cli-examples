import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  Motion,
  IMotion,
  EasyTrackConfig,
  IEasyTrackConfig,
} from "../../../types/schema";
import { _loadEasyTrackConfigEntity } from "../../../helpers";
import { ZERO } from "../../../constants";

/**
 * @dev Event::MotionCreated(uint256 _motionId, address _creator, address _evmScriptFactory, bytes _evmScriptCallData, bytes _evmScript)
 * @param context trigger object with contains {event: {_motionId ,_creator ,_evmScriptFactory ,_evmScriptCallData ,_evmScript }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MotionCreatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for MotionCreated here

  const { event, transaction, block, log } = context;
  const {
    _motionId,
    _creator,
    _evmScriptFactory,
    _evmScriptCallData,
    _evmScript,
  } = event;

  const motionDB: Instance = bind(Motion);
  let entity: IMotion = await motionDB.findOne({ id: _motionId.toString() });

  if (!entity) {
    entity = await motionDB.create({ id: _motionId.toString() });

    const easyTrackConfigDB: Instance = bind(EasyTrackConfig);

    let config: IEasyTrackConfig =
      await _loadEasyTrackConfigEntity(easyTrackConfigDB);

    entity.snapshot_block = block.block_number;
    entity.start_date = block.block_timestamp;

    entity.creator = _creator.toString();

    entity.duration = config.motion_duration;
    entity.evm_script_hash = _evmScript.toString();
    entity.evm_script_factory = _evmScriptFactory.toString();
    entity.objections_amount_pct = Number(ZERO);
    entity.objections_threshold = config.objections_threshold;
    entity.objections_amount = Number(ZERO);
    entity.evm_script_calldata = _evmScriptCallData.toString();
    entity.status = "ACTIVE";

    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.log_index = log.log_index;
  }

  await motionDB.save(entity);
};
