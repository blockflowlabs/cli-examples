import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleConfig, LidoOracleConfig } from "../../../types/schema";
import { _loadLidoOracleConfigEntity } from "../../../helpers";

/**
 * @dev Event::AllowedBeaconBalanceRelativeDecreaseSet(uint256 value)
 * @param context trigger object with contains {event: {value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AllowedBeaconBalanceRelativeDecreaseSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AllowedBeaconBalanceRelativeDecreaseSet here

  const { event, transaction, block, log } = context;
  const { value } = event;

  const lidoOracleConfigDB = bind(LidoOracleConfig);

  let oracleConfig: ILidoOracleConfig =
    await _loadLidoOracleConfigEntity(lidoOracleConfigDB);

  oracleConfig.allowed_beacon_balance_relative_decrease = value.toString();

  await lidoOracleConfigDB.save(oracleConfig);
};
