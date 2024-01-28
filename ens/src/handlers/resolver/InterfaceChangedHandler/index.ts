import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::InterfaceChanged(bytes32 node, bytes4 interfaceID, address implementer)
 * @param context trigger object with contains {event: {node ,interfaceID ,implementer }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const InterfaceChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for InterfaceChanged here

  const { event, transaction, block, log } = context;
  const { node, interfaceID, implementer } = event;
};
