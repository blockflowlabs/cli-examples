import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Strategy, Stats } from "../../types/generated";
import { updateStats } from "../../utils/helpers";
/**
 * @dev Event::StrategyRemovedFromDepositWhitelist(address strategy)
 * @param context trigger object with contains {event: {strategy }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StrategyRemovedFromDepositWhitelistHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for StrategyRemovedFromDepositWhitelist here

  const { event, transaction, block, log } = context;
  const { strategy } = event;

  const client = Instance.PostgresClient(bind);

  const strategyDb = client.db(Strategy);
  const statsDb = client.db(Stats);

  const strategyData = await strategyDb.load({ address: strategy.toLowerCase() });

  if (strategyData) {
    if (strategyData.isDepositWhitelist) {
      await updateStats(statsDb, "totalDepositWhitelistStrategies", 1, "subtract");
    }
    strategyData.isDepositWhitelist = false;
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  }
};
