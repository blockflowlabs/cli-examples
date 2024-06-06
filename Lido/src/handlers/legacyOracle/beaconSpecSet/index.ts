import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleConfig, LidoOracleConfig } from "../../../types/schema";
import { _loadLidoOracleConfigEntity } from "../../../helpers";

/**
 * @dev Event::BeaconSpecSet(uint64 epochsPerFrame, uint64 slotsPerEpoch, uint64 secondsPerSlot, uint64 genesisTime)
 * @param context trigger object with contains {event: {epochsPerFrame ,slotsPerEpoch ,secondsPerSlot ,genesisTime }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BeaconSpecSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BeaconSpecSet here

  const { event, transaction, block, log } = context;
  const { epochsPerFrame, slotsPerEpoch, secondsPerSlot, genesisTime } = event;

  const lidoOracleConfigDB = bind(LidoOracleConfig);

  let oracleConfig: ILidoOracleConfig =
    await _loadLidoOracleConfigEntity(lidoOracleConfigDB);

  oracleConfig.epochs_per_frame = epochsPerFrame.toString();
  oracleConfig.slots_per_epoch = slotsPerEpoch.toString();
  oracleConfig.seconds_per_slot = secondsPerSlot.toString();
  oracleConfig.genesis_time = genesisTime.toString();

  await lidoOracleConfigDB.save(oracleConfig);
};
