import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Deposit, Strategies } from "../../types/schema";
import { eigenContracts } from "../../data/address";
import { getSharesToUnderlying } from "../../utils/helpers";
import BigNumber from "bignumber.js";

/**
 * @dev Event::Deposit(address staker, address token, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {staker ,token ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Deposit here

  const { event, transaction, block, log } = context;
  const { staker, token, strategy, shares } = event;

  const depositDb = bind(Deposit);
  const strategyDb = bind(Strategies);

  const depositId =
    `${transaction.transaction_hash}_${log.log_index}`.toLowerCase();

  const depositData = await depositDb.findOne({
    id: depositId,
  });

  if (!depositData) {
    await depositDb.create({
      id: depositId,
      transactionHash: transaction.transaction_hash,
      stakerAddress: staker.toLowerCase(),
      tokenAddress: token.toLowerCase(),
      strategyAddress: strategy.toLowerCase(),
      shares: shares.toString(),
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
    });
  }

  const rpcEndpoint = secrets["RPC_ENDPOINT"];
  const sharesToUnderlying =
    eigenContracts.Strategies.Eigen?.strategyContract.toLowerCase() ===
    strategy.toLowerCase()
      ? BigInt(1e18)
      : await getSharesToUnderlying(strategy, (1e18).toString(), rpcEndpoint);

  const strategyData = await strategyDb.findOne({
    id: strategy.toLowerCase(),
  });

  const strategyKeys = Object.keys(eigenContracts.Strategies);
  const strategies = Object.values(eigenContracts.Strategies);
  const strategyIndex = strategies.findIndex(
    (s) => s.strategyContract.toLowerCase() === strategy.toLowerCase()
  );

  if (strategyData && strategyIndex !== -1) {
    const newTotalShares = new BigNumber(
      strategyData.totalShares.toString()
    ).plus(shares.toString());

    strategyData.sharesToUnderlying = sharesToUnderlying.toString();
    strategyData.totalShares = newTotalShares.toString();
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;
    await strategyDb.save(strategyData);
  } else if (strategyIndex !== -1) {
    await strategyDb.create({
      id: strategy.toLowerCase(),
      address: strategy.toLowerCase(),
      symbol: strategyKeys[strategyIndex],
      totalShares: shares.toString(),
      sharesToUnderlying: sharesToUnderlying.toString(),
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAt: block.block_timestamp,
      updatedAtBlock: block.block_number,
    });
  }
};
