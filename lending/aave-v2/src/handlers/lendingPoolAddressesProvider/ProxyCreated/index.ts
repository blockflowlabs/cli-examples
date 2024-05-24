import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::ProxyCreated(bytes32 id, address newAddress)
 * @param context trigger object with contains {event: {id ,newAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ProxyCreatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ProxyCreated here

  const { event, transaction, block, log } = context;
  const { id, newAddress } = event;
};
