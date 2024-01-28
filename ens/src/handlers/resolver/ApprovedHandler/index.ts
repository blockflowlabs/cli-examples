import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::Approved(address owner, bytes32 node, address delegate, bool approved)
 * @param context trigger object with contains {event: {owner ,node ,delegate ,approved }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ApprovedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for Approved here

  const { event, transaction, block, log } = context;
  const { owner, node, delegate, approved } = event;
};
