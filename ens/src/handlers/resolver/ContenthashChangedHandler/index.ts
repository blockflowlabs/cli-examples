import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::ContenthashChanged(bytes32 node, bytes hash)
 * @param context trigger object with contains {event: {node ,hash }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ContenthashChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for ContenthashChanged here

  const { event, transaction, block, log } = context;
  const { node, hash } = event;
};
