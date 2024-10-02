import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Strategy } from "../../types/schema";

/**
 * @dev Event::StrategyRemovedFromDepositWhitelist(address strategy)
 * @param context trigger object with contains {event: {strategy }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StrategyRemovedFromDepositWhitelistHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for StrategyRemovedFromDepositWhitelist here

  const { event, transaction, block, log } = context;
  const { strategy } = event;

  const strategyDb: Instance = bind(Strategy);

  const strategyData = await strategyDb.findOne({ id: strategy.toLowerCase() });

  if (strategyData) {
    strategyData.isDepositWhitelist = false;
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  }
};
