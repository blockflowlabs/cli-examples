import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::NewResolver(bytes32 node, address resolver)
 * @param context trigger object with contains {event: {node ,resolver }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewResolverHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NewResolver here

  const { event, transaction, block, log } = context;
  const { node, resolver } = event;
};
