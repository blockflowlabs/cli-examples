import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoOracleReport, LidoOracleReport } from "../../../types/schema";
import { _loadLidoOracleReportEntity } from "../../../helpers";

/**
 * @dev Event::ExtraDataSubmitted(uint256 refSlot, uint256 itemsProcessed, uint256 itemsCount)
 * @param context trigger object with contains {event: {refSlot ,itemsProcessed ,itemsCount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ExtraDataSubmittedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ExtraDataSubmitted here

  const { event, transaction, block, log } = context;
  const { refSlot, itemsProcessed, itemsCount } = event;

  const lidoOracleReportDB: Instance = bind(LidoOracleReport);

  let entity: ILidoOracleReport = await _loadLidoOracleReportEntity(
    lidoOracleReportDB,
    context,
  );

  entity.items_processed = itemsProcessed.toString();
  entity.items_count = itemsCount.toString();

  await lidoOracleReportDB.save(entity);

  //to do
};
