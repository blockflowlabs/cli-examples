import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::NameChanged(bytes32 node, string name)
 * @param context trigger object with contains {event: {node ,name }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NameChanged here

  const { event, transaction, block, log } = context;
  const { node, name } = event;
};
