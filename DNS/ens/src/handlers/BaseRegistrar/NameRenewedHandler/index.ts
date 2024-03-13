import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::NameRenewed(uint256 id, uint256 expires)
 * @param context trigger object with contains {event: {id ,expires }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameRenewedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NameRenewed here

  const { event, transaction, block, log } = context;
  const { id, expires } = event;
};
