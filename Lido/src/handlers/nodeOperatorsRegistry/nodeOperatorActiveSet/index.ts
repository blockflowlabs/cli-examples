import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoNodeOperator, LidoNodeOperator } from "../../../types/schema";
import { _loadLidoNodeOperatorEntity } from "../../../helpers";

/**
 * @dev Event::NodeOperatorActiveSet(uint256 id, bool active)
 * @param context trigger object with contains {event: {id ,active }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorActiveSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NodeOperatorActiveSet here

  const { event, transaction, block, log } = context;
  const { id, active } = event;

  const lidoNodeOperatorDB: Instance = bind(LidoNodeOperator);

  let operator: ILidoNodeOperator = await _loadLidoNodeOperatorEntity(
    lidoNodeOperatorDB,
    id,
  );

  operator.active = active;

  await lidoNodeOperatorDB.save(operator);
};
