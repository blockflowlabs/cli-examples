import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::NameRegistered(uint256 id, address owner, uint256 expires)
 * @param context trigger object with contains {event: {id ,owner ,expires }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameRegisteredHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NameRegistered here

  const { event, transaction, block, log } = context;
  const { id, owner, expires } = event;
};
