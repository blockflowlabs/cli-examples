import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::OperatorRegistered(address operator, bytes32 operatorId)
 * @param context trigger object with contains {event: {operator ,operatorId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorRegisteredHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorRegistered here

  const { event, transaction, block, log } = context;
  const { operator, operatorId } = event;
};
