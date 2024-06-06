import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoNodeOperator, LidoNodeOperator } from "../../../types/schema";
import { _loadLidoNodeOperatorEntity } from "../../../helpers";

/**
 * @dev Event::NodeOperatorTotalKeysTrimmed(uint256 id, uint64 totalKeysTrimmed)
 * @param context trigger object with contains {event: {id ,totalKeysTrimmed }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorTotalKeysTrimmedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorTotalKeysTrimmed here

  const { event, transaction, block, log } = context;
  const { id, totalKeysTrimmed } = event;

  const lidoNodeOperatorDB: Instance = bind(LidoNodeOperator);

  let operator: ILidoNodeOperator = await _loadLidoNodeOperatorEntity(
    lidoNodeOperatorDB,
    id,
  );

  operator.total_keys_trimmed = totalKeysTrimmed.toString();

  await lidoNodeOperatorDB.save(operator);
};
