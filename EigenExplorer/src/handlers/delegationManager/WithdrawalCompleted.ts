import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Strategy, Withdrawal, Stats } from "../../types/generated";
import BigNumber from "bignumber.js";
import { SHARES_OFFSET } from "../../data/constants";
import { updateStats } from "../../utils/helpers";
/**
 * @dev Event::WithdrawalCompleted(bytes32 withdrawalRoot)
 * @param context trigger object with contains {event: {withdrawalRoot }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalCompletedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for WithdrawalCompleted here

  const { event, transaction, block, log } = context;
  const { withdrawalRoot } = event;

  const client = Instance.PostgresClient(bind);

  const withdrawalDb = client.db(Withdrawal);
  const strategiesDb = client.db(Strategy);
  const statsDb = client.db(Stats);

  const withdrawalData = await withdrawalDb.load({ rowId: withdrawalRoot });

  // update the withdrawal record
  if (withdrawalData) {
    withdrawalData.isCompleted = true;
    withdrawalData.updatedAt = block.block_timestamp;
    withdrawalData.updatedAtBlock = block.block_number;

    const strategyIds = withdrawalData.strategyShares.map((strategy: any) => strategy.strategy.toLowerCase());
    const strategiesData = await strategiesDb.loadMany({ address: { $in: strategyIds } });

    const strategiesMap = strategiesData.reduce((map: any, strategy: any) => {
      map[strategy.id] = strategy;
      return map;
    }, {});

    for (const key in withdrawalData.strategyShares) {
      const shares = withdrawalData.strategyShares[key];

      const strategyData = strategiesMap[shares.strategy.toLowerCase()];

      if (strategyData) {
        // data prior to withdrawal
        const totalShares = new BigNumber(strategyData.totalShares);
        const sharesToMinus = new BigNumber(shares.shares.toString());

        // new total shares after withdrawal for the strategy
        const newTotalShares = totalShares.isGreaterThan(sharesToMinus)
          ? totalShares.minus(sharesToMinus).toString()
          : "0";

        // calculate virtual prior shares and balance by adding offset
        const virtualPriorShares = new BigNumber(strategyData.totalShares).plus(SHARES_OFFSET.toString());
        const virtualPriorBalance = new BigNumber(strategyData.totalAmount).plus(SHARES_OFFSET.toString());

        // calculate amount to minus from shares
        const amountToMinus = virtualPriorBalance.multipliedBy(shares.shares.toString()).dividedBy(virtualPriorShares);

        // new total amount after withdrawal for the strategy
        const newTotalAmount = new BigNumber(strategyData.totalAmount).isGreaterThan(amountToMinus)
          ? new BigNumber(strategyData.totalAmount).minus(amountToMinus).toString()
          : "0";

        // calculate new sharesToUnderlying for the strategy after withdrawal
        const virtualTotalShares = new BigNumber(newTotalShares).plus(SHARES_OFFSET.toString());
        const virtualTotalBalance = new BigNumber(newTotalAmount).plus(SHARES_OFFSET.toString());

        const sharesToUnderlying = virtualTotalBalance.multipliedBy("1e18").dividedBy(virtualTotalShares);

        // update the strategy data
        strategyData.sharesToUnderlying = sharesToUnderlying.toString();
        strategyData.totalShares = newTotalShares;
        strategyData.totalAmount = newTotalAmount;
        strategyData.totalWithdrawals = Number(strategyData.totalWithdrawals) + 1 || 1;
        strategyData.updatedAt = block.block_timestamp;
        strategyData.updatedAtBlock = block.block_number;
        await strategiesDb.save(strategyData);

        // add the amount for strategy to the withdrawal data
        withdrawalData.strategyShares[key].amount = amountToMinus.toString();
      }
    }

    await withdrawalDb.save(withdrawalData);
  }

  await updateStats(statsDb, "totalCompletedWithdrawals", 1, "add");
};
