import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

/**
 * @dev Event::ExecuteFailed(address avoSafeOwner, address avoSafeAddress, address source, bytes metadata, string reason)
 * @param context trigger object with contains {event: {avoSafeOwner ,avoSafeAddress ,source ,metadata ,reason }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ExecuteFailedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ExecuteFailed here

  const { event, transaction, block, log } = context
  const { avoSafeOwner, avoSafeAddress, source, metadata, reason } = event
}
