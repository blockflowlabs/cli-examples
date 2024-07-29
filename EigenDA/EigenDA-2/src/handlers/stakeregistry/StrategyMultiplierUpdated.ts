import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::StrategyMultiplierUpdated(uint8 quorumNumber, address strategy, uint256 multiplier)
 * @param context trigger object with contains {event: {quorumNumber ,strategy ,multiplier }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StrategyMultiplierUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for StrategyMultiplierUpdated here

  const { event, transaction, block, log } = context;
  const { quorumNumber, strategy, multiplier } = event;
};
