import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Strategy, Withdrawal } from "../../types/schema";
import BigNumber from "bignumber.js";
import { SHARES_OFFSET } from "../../data/constants";
/**
 * @dev Event::WithdrawalCompleted(bytes32 withdrawalRoot)
 * @param context trigger object with contains {event: {withdrawalRoot }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalCompletedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for WithdrawalCompleted here

  const { event, transaction, block, log } = context;
  const { withdrawalRoot } = event;

  const withdrawalDb: Instance = bind(Withdrawal);
  const strategiesDb: Instance = bind(Strategy);

  const withdrawalData = await withdrawalDb.findOne({ id: withdrawalRoot });

  // update the withdrawal record
  if (withdrawalData) {
    withdrawalData.isCompleted = true;
    withdrawalData.updatedAt = block.block_timestamp;
    withdrawalData.updatedAtBlock = block.block_number;

    await withdrawalDb.save(withdrawalData);

    for (const key in withdrawalData.strategyShares) {
      const shares = withdrawalData.strategyShares[key];

      const strategyData = await strategiesDb.findOne({
        id: shares.strategy.toLowerCase(),
      });

      if (strategyData) {
        console.log(shares.shares.toString());
        const totalShares = new BigNumber(strategyData.totalShares);
        const sharesToMinus = new BigNumber(shares.shares.toString());

        const newTotalShares = totalShares.isGreaterThan(sharesToMinus)
          ? totalShares.minus(sharesToMinus).toString()
          : "0";

        const virtualPriorShares = new BigNumber(strategyData.totalShares).plus(
          SHARES_OFFSET.toString()
        );
        const virtualPriorBalance = new BigNumber(
          strategyData.totalAmount
        ).plus(SHARES_OFFSET.toString());

        const amountToMinus = virtualPriorBalance
          .multipliedBy(shares.shares.toString())
          .dividedBy(virtualPriorShares);

        const newTotalAmount = new BigNumber(
          strategyData.totalAmount
        ).isGreaterThan(amountToMinus)
          ? new BigNumber(strategyData.totalAmount)
              .minus(amountToMinus)
              .toString()
          : "0";

        const virtualTotalShares = new BigNumber(newTotalShares).plus(
          SHARES_OFFSET.toString()
        );
        const virtualTotalBalance = new BigNumber(newTotalAmount).plus(
          SHARES_OFFSET.toString()
        );

        const sharesToUnderlying = virtualTotalBalance
          .multipliedBy("1e18")
          .dividedBy(virtualTotalShares);

        strategyData.sharesToUnderlying = sharesToUnderlying.toString();
        strategyData.totalShares = newTotalShares;
        strategyData.totalAmount = newTotalAmount;
        strategyData.updatedAt = block.block_timestamp;
        strategyData.updatedAtBlock = block.block_number;
        await strategiesDb.save(strategyData);
      }
    }
  }
};
