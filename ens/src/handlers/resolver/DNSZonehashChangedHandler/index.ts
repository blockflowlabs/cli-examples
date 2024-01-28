import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::DNSZonehashChanged(bytes32 node, bytes lastzonehash, bytes zonehash)
 * @param context trigger object with contains {event: {node ,lastzonehash ,zonehash }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DNSZonehashChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for DNSZonehashChanged here

  const { event, transaction, block, log } = context;
  const { node, lastzonehash, zonehash } = event;
};
