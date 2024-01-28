import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::DNSRecordChanged(bytes32 node, bytes name, uint16 resource, bytes record)
 * @param context trigger object with contains {event: {node ,name ,resource ,record }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DNSRecordChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for DNSRecordChanged here

  const { event, transaction, block, log } = context;
  const { node, name, resource, record } = event;
};
