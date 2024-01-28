import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::DNSRecordDeleted(bytes32 node, bytes name, uint16 resource)
 * @param context trigger object with contains {event: {node ,name ,resource }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DNSRecordDeletedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for DNSRecordDeleted here

  const { event, transaction, block, log } = context;
  const { node, name, resource } = event;
};
