import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param context trigger object with contains {event: {from ,to ,tokenId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;
};
