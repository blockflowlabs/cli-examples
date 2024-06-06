import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleConfig, LidoOracleConfig } from "../../../types/schema";
import { _loadLidoOracleConfigEntity } from "../../../helpers";

/**
 * @dev Event::QuorumChanged(uint256 quorum)
 * @param context trigger object with contains {event: {quorum }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const QuorumChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for QuorumChanged here

  const { event, transaction, block, log } = context;
  const { quorum } = event;

  const lidoOracleConfigDB = bind(LidoOracleConfig);

  let oracleConfig: ILidoOracleConfig =
    await _loadLidoOracleConfigEntity(lidoOracleConfigDB);

  oracleConfig.quorum = quorum.toString();

  await lidoOracleConfigDB.save(oracleConfig);
};
