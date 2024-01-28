import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::AddrChanged(bytes32 node, address a)
 * @param context trigger object with contains {event: {node ,a }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddrChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for AddrChanged here

  const { event, transaction, block, log } = context;
  const { node, a } = event;
};
