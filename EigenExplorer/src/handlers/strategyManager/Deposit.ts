import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Deposit, Strategy, Stats } from "../../types/schema";
import BigNumber from "bignumber.js";
import { BALANCE_OFFSET, SHARES_OFFSET } from "../../data/constants";
import { getStrategyDataFromNode, updateStats } from "../../utils/helpers";

/**
 * @dev Event::Deposit(address staker, address token, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {staker ,token ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for Deposit here

  const { event, transaction, block, log } = context;
  const { staker, token, strategy, shares } = event;

  const depositDb = bind(Deposit);
  const strategyDb = bind(Strategy);
  const statsDb = bind(Stats);

  const depositId = `${transaction.transaction_hash}_${log.log_index}`.toLowerCase();

  let amount: string;
  const strategyData = await strategyDb.findOne({
    id: strategy.toLowerCase(),
  });

  if (strategyData) {
    const priorTotalShares = new BigNumber(strategyData.totalShares.toString());
    const priorTotalAmount = new BigNumber(strategyData.totalAmount.toString());

    const priorSharesToUnderlying = strategyData.sharesToUnderlying;
    amount = new BigNumber(shares).multipliedBy(priorSharesToUnderlying).dividedBy("1e18").toString();

    const newTotalShares = priorTotalShares.plus(shares);
    const newTotalAmount = priorTotalAmount.plus(amount);

    const virtualPriorShares = newTotalShares.plus(SHARES_OFFSET.toString());
    const virtualPriorBalance = newTotalAmount.plus(BALANCE_OFFSET.toString());

    const newSharesToUnderlying = virtualPriorBalance.multipliedBy("1e18").dividedBy(virtualPriorShares);

    strategyData.sharesToUnderlying = newSharesToUnderlying.toString();
    strategyData.totalShares = newTotalShares.toString();
    strategyData.totalAmount = newTotalAmount.toString();
    strategyData.totalDeposits = strategyData.totalDeposits + 1 || 1;
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  } else {
    amount = shares.toString();
    const { underlyingTokenAddress, name, symbol, decimals } = (await getStrategyDataFromNode(strategy, secrets)) || {};
    await strategyDb.create({
      id: strategy.toLowerCase(),
      address: strategy.toLowerCase(),
      symbol: symbol || "",
      underlyingToken: {
        address: underlyingTokenAddress.toLowerCase() || "",
        name: name || "",
        symbol: symbol || "",
        decimals: Number(decimals) || 18,
      },
      isDepositWhitelist: true,
      sharesToUnderlying: (1e18).toString(),
      totalShares: shares.toString(),
      totalAmount: shares.toString(),
      totalDeposits: 1,
      totalWithdrawals: 0,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  }

  await depositDb.create({
    id: depositId,
    transactionHash: transaction.transaction_hash,
    stakerAddress: staker.toLowerCase(),
    tokenAddress: token.toLowerCase(),
    strategyAddress: strategy.toLowerCase(),
    shares: shares.toString(),
    amount: amount,
    createdAt: block.block_timestamp,
    createdAtBlock: block.block_number,
  });

  await updateStats(statsDb, "totalDeposits", 1);
};
