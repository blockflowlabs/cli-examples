import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::OperatorSocketUpdate(bytes32 operatorId, string socket)
 * @param context trigger object with contains {event: {operatorId ,socket }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSocketUpdateHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorSocketUpdate here

  const { event, transaction, block, log } = context;
  const { operatorId, socket } = event;
};
