import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Deposit, Strategy, Stats } from "../../types/schema";
import { updateStats } from "../../utils/helpers";
import { SHARES_OFFSET, BALANCE_OFFSET } from "../../data/constants";
import BigNumber from "bignumber.js";

/**
 * @dev Event::Deposit(address staker, address token, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {staker ,token ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for Deposit here

  const { event, transaction, block, log } = context;
  const { staker, token, strategy, shares, amount } = event;

  const depositDb = bind(Deposit);
  const strategyDb = bind(Strategy);
  const statsDb = bind(Stats);

  const depositId = `${transaction.transaction_hash}_${log.log_index}`.toLowerCase();

  await depositDb.create({
    id: depositId,
    transactionHash: transaction.transaction_hash,
    stakerAddress: staker.toLowerCase(),
    tokenAddress: token.toLowerCase(),
    strategyAddress: strategy.toLowerCase(),
    shares: shares.toString(),
    amount: amount.toString(),
    createdAt: block.block_timestamp,
    createdAtBlock: block.block_number,
  });

  const strategyData = await strategyDb.findOne({
    id: strategy.toLowerCase(),
  });

  if (strategyData) {
    // get new total shares and total amount
    const newTotalShares = new BigNumber(strategyData.totalShares.toString()).plus(shares.toString());
    const newTotalAmount = new BigNumber(strategyData.totalAmount).plus(amount.toString());

    // calculate new sharesToUnderlying after deposit
    const virtualPriorShares = newTotalShares.plus(SHARES_OFFSET.toString());
    const virtualPriorBalance = newTotalAmount.plus(BALANCE_OFFSET.toString());

    const sharesToUnderlying = virtualPriorBalance.multipliedBy("1e18").dividedBy(virtualPriorShares);

    // update strategy data
    strategyData.sharesToUnderlying = sharesToUnderlying.toString();
    strategyData.totalShares = newTotalShares.toString();
    strategyData.totalAmount = newTotalAmount.toString();
    strategyData.totalDeposits += 1;
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  }

  await updateStats(statsDb, "totalDeposits", 1);
};
