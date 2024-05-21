import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleReport, LidoOracleReport } from "../../../types/schema";
import { _loadLidoOracleReportEntity } from "../../../helpers";

/**
 * @dev Event::ProcessingStarted(uint256 refSlot, bytes32 hash)
 * @param context trigger object with contains {event: {refSlot ,hash }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ProcessingStartedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ProcessingStarted here

  const { event, transaction, block, log } = context;
  const { refSlot, hash } = event;

  const lidoOracleReportDB: Instance = bind(LidoOracleReport);

  let entity: ILidoOracleReport = await _loadLidoOracleReportEntity(
    lidoOracleReportDB,
    context,
    true,
  );

  //need to be changed
  entity.total_reward = transaction.transaction_hash;

  entity.hash = hash;

  await lidoOracleReportDB.save(entity);
};
