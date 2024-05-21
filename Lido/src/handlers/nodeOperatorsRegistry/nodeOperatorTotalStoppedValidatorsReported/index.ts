import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoNodeOperator, LidoNodeOperator } from "../../../types/schema";
import { _loadLidoNodeOperatorEntity } from "../../../helpers";

/**
 * @dev Event::NodeOperatorTotalStoppedValidatorsReported(uint256 id, uint64 totalStopped)
 * @param context trigger object with contains {event: {id ,totalStopped }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorTotalStoppedValidatorsReportedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorTotalStoppedValidatorsReported here

  const { event, transaction, block, log } = context;
  const { id, totalStopped } = event;

  const lidoNodeOperatorDB: Instance = bind(LidoNodeOperator);

  let operator: ILidoNodeOperator = await _loadLidoNodeOperatorEntity(
    lidoNodeOperatorDB,
    id,
  );

  operator.staking_limit = totalStopped.toString();

  await lidoNodeOperatorDB.save(operator);
};
