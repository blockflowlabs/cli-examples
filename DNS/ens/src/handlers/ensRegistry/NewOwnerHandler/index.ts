import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::NewOwner(bytes32 node, bytes32 label, address owner)
 * @param context trigger object with contains {event: {node ,label ,owner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewOwnerHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NewOwner here

  const { event, transaction, block, log } = context;
  const { node, label, owner } = event;
};
