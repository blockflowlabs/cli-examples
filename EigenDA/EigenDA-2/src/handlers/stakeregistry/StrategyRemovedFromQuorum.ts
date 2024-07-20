import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::StrategyRemovedFromQuorum(uint8 quorumNumber, address strategy)
 * @param context trigger object with contains {event: {quorumNumber ,strategy }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StrategyRemovedFromQuorumHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for StrategyRemovedFromQuorum here

  const { event, transaction, block, log } = context;
  const { quorumNumber, strategy } = event;
};