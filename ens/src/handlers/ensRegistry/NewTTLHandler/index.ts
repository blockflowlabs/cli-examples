import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::NewTTL(bytes32 node, uint64 ttl)
 * @param context trigger object with contains {event: {node ,ttl }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewTTLHandler = async (context: IEventContext, bind: Function) => {
  // Implement your event handler logic for NewTTL here

  const { event, transaction, block, log } = context;
  const { node, ttl } = event;
};
