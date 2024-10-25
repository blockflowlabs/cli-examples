import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Strategy, Stats } from "../../types/generated";
import { updateStats, getStrategyMetadata } from "../../utils/helpers";

/**
 * @dev Event::StrategyAddedToDepositWhitelist(address strategy)
 * @param context trigger object with contains {event: {strategy }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StrategyAddedToDepositWhitelistHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for StrategyAddedToDepositWhitelist here

  const { event, transaction, block, log } = context;
  const { strategy } = event;

  const { underlyingTokenAddress, name, symbol, decimals } = (await getStrategyMetadata(strategy, secrets)) || {};

  const client = Instance.PostgresClient(bind);

  const strategyDb = client.db(Strategy);
  const statsDb = client.db(Stats);

  const strategyData = await strategyDb.load({ address: strategy.toLowerCase() });

  if (strategyData) {
    if (!strategyData.isDepositWhitelist) {
      await updateStats(statsDb, "totalDepositWhitelistStrategies", 1, "add");
    }
    strategyData.isDepositWhitelist = true;
    strategyData.underlyingToken = {
      address: underlyingTokenAddress || "",
      name: name || "",
      symbol: symbol || "",
      decimals: Number(decimals) || 18,
    };
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  } else {
    await strategyDb.save({
      address: strategy.toLowerCase(),
      symbol: symbol,
      underlyingToken: {
        address: underlyingTokenAddress || "",
        name: name || "",
        symbol: symbol || "",
        decimals: Number(decimals) || 18,
      },
      isDepositWhitelist: true,
      sharesToUnderlying: (1e18).toString(),
      totalShares: "0",
      totalAmount: "0",
      totalDeposits: 0,
      totalWithdrawals: 0,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
    await updateStats(statsDb, "totalDepositWhitelistStrategies", 1, "add");
  }
};
