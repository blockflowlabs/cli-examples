import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleConfig, LidoOracleConfig } from "../../../types/schema";
import { _loadLidoOracleConfigEntity } from "../../../helpers";

/**
 * @dev Event::ContractVersionSet(uint256 version)
 * @param context trigger object with contains {event: {version }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ContractVersionSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ContractVersionSet here

  const { event, transaction, block, log } = context;
  const { version } = event;

  const lidoOracleConfigDB = bind(LidoOracleConfig);

  let oracleConfig: ILidoOracleConfig =
    await _loadLidoOracleConfigEntity(lidoOracleConfigDB);

  oracleConfig.contract_version = version.toString();

  await lidoOracleConfigDB.save(oracleConfig);
};
