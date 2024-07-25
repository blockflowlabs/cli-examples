import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::OrderInvalidated(address owner, bytes orderUid)
 * @param context trigger object with contains {event: {owner ,orderUid }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OrderInvalidatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OrderInvalidated here

  const { event, transaction, block, log } = context;
  const { owner, orderUid } = event;
};
