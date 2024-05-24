import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::AddressSet(bytes32 id, address newAddress, bool hasProxy)
 * @param context trigger object with contains {event: {id ,newAddress ,hasProxy }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddressSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AddressSet here

  const { event, transaction, block, log } = context;
  const { id, newAddress, hasProxy } = event;
};
