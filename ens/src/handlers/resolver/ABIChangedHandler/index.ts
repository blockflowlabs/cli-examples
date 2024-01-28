import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::ABIChanged(bytes32 node, uint256 contentType)
 * @param context trigger object with contains {event: {node ,contentType }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ABIChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for ABIChanged here

  const { event, transaction, block, log } = context;
  const { node, contentType } = event;
};
