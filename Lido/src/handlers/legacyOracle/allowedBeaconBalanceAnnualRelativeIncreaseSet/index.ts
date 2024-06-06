import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleConfig, LidoOracleConfig } from "../../../types/schema";
import { _loadLidoOracleConfigEntity } from "../../../helpers";

/**
 * @dev Event::AllowedBeaconBalanceAnnualRelativeIncreaseSet(uint256 value)
 * @param context trigger object with contains {event: {value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AllowedBeaconBalanceAnnualRelativeIncreaseSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AllowedBeaconBalanceAnnualRelativeIncreaseSet here

  const { event, transaction, block, log } = context;
  const { value } = event;

  const lidoOracleConfigDB = bind(LidoOracleConfig);

  let oracleConfig: ILidoOracleConfig =
    await _loadLidoOracleConfigEntity(lidoOracleConfigDB);

  oracleConfig.allowed_beacon_balance_annual_relative_increase =
    value.toString();

  await lidoOracleConfigDB.save(oracleConfig);
};
