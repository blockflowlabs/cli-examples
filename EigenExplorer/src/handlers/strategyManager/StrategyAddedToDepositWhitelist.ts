import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Strategy, Stats } from "../../types/schema";
import { strategyAbi } from "../../data/abi/strategy";
import { erc20Abi } from "../../data/abi/erc20";
import { ethers } from "ethers";
import { updateStats } from "../../utils/helpers";

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

  const rpcEndpoint = secrets["RPC_ENDPOINT"];
  const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);

  const strategyContract = new ethers.Contract(strategy, strategyAbi, provider);
  const underlyingTokenAddress = await strategyContract.underlyingToken();

  // fetch name, symbol and decimals of the underlying token
  const underlyingTokenContract = new ethers.Contract(underlyingTokenAddress, erc20Abi, provider);

  const [name, symbol, decimals] = await Promise.all([
    underlyingTokenContract.name(),
    underlyingTokenContract.symbol(),
    underlyingTokenContract.decimals(),
  ]);

  const strategyDb: Instance = bind(Strategy);
  const statsDb: Instance = bind(Stats);

  const strategyData = await strategyDb.findOne({ id: strategy.toLowerCase() });

  if (strategyData) {
    if (!strategyData.isDepositWhitelist) {
      await updateStats(statsDb, "totalDepositWhitelistStrategies", 1, "add");
    }
    strategyData.isDepositWhitelist = true;
    strategyData.underlyingToken = {
      address: underlyingTokenAddress,
      name: name,
      symbol: symbol,
      decimals: Number(decimals),
    };
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  } else {
    await strategyDb.create({
      id: strategy.toLowerCase(),
      address: strategy.toLowerCase(),
      symbol: symbol,
      underlyingToken: {
        address: underlyingTokenAddress,
        name: name,
        symbol: symbol,
        decimals: Number(decimals),
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
