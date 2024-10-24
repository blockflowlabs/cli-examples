import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Deposit, Strategy, Stats, Staker } from "../../types/generated";
import { Instance } from "@blockflow-labs/sdk";
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
  const { staker, token, strategy, shares } = event;

  const client = Instance.PostgresClient(bind);

  const depositDb = client.db(Deposit);
  const strategyDb = client.db(Strategy);
  const statsDb = client.db(Stats);
  const stakerDb = client.db(Staker);

  const depositId = `${transaction.transaction_hash}_${log.log_index}`.toLowerCase();

  const stakerData = await stakerDb.load({ address: staker.toLowerCase() });

  if (stakerData) {
    stakerData.totalDeposits = Number(stakerData.totalDeposits) + 1 || 1;

    await stakerDb.save(stakerData);
  }

  const strategyData = await strategyDb.load({
    address: strategy.toLowerCase(),
  });

  let amount = shares.toString();

  if (strategyData) {
    // get new total shares and total amount
    const newTotalShares = new BigNumber(strategyData.totalShares.toString()).plus(shares.toString());
    const newTotalAmount = new BigNumber(strategyData.totalAmount).plus(amount.toString());
    amount = newTotalAmount.toString();

    // calculate new sharesToUnderlying after deposit
    const virtualPriorShares = newTotalShares.plus(SHARES_OFFSET.toString());
    const virtualPriorBalance = newTotalAmount.plus(BALANCE_OFFSET.toString());

    const sharesToUnderlying = virtualPriorBalance.multipliedBy("1e18").dividedBy(virtualPriorShares);

    // update strategy data
    strategyData.sharesToUnderlying = sharesToUnderlying.toString();
    strategyData.totalShares = newTotalShares.toString();
    strategyData.totalAmount = newTotalAmount.toString();
    strategyData.totalDeposits = Number(strategyData.totalDeposits) + 1 || 1;
    strategyData.updatedAt = block.block_timestamp;
    strategyData.updatedAtBlock = block.block_number;

    await strategyDb.save(strategyData);
  }

  await depositDb.save({
    rowId: depositId,
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
