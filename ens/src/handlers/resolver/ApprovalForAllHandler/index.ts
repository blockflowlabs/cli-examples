import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::ApprovalForAll(address owner, address operator, bool approved)
 * @param context trigger object with contains {event: {owner ,operator ,approved }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ApprovalForAllHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for ApprovalForAll here

  const { event, transaction, block, log } = context;
  const { owner, operator, approved } = event;
};
