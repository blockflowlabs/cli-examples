import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleConfig, LidoOracleConfig } from "../../../types/schema";
import { _loadLidoOracleConfigEntity } from "../../../helpers";

/**
 * @dev Event::BeaconReportReceiverSet(address callback)
 * @param context trigger object with contains {event: {callback }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BeaconReportReceiverSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BeaconReportReceiverSet here

  const { event, transaction, block, log } = context;
  const { callback } = event;

  const lidoOracleConfigDB = bind(LidoOracleConfig);

  let oracleConfig: ILidoOracleConfig =
    await _loadLidoOracleConfigEntity(lidoOracleConfigDB);

  oracleConfig.beacon_report_receiver = callback.toString().toLowerCase();

  await lidoOracleConfigDB.save(oracleConfig);
};
