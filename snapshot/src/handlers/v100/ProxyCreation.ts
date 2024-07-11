import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::ProxyCreation(address proxy)
 * @param context trigger object with contains {event: {proxy }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ProxyCreationHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ProxyCreation here

  const { event, transaction, block, log } = context;
  const { proxy } = event;

  
};
