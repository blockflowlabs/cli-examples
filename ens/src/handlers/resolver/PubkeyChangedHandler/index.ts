import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::PubkeyChanged(bytes32 node, bytes32 x, bytes32 y)
 * @param context trigger object with contains {event: {node ,x ,y }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PubkeyChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for PubkeyChanged here

  const { event, transaction, block, log } = context;
  const { node, x, y } = event;
};
