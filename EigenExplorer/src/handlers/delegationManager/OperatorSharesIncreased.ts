import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Operator, Staker, StrategyShares } from "../../types/schema";
import BigNumber from "bignumber.js";

/**
 * @dev Event::OperatorSharesIncreased(address operator, address staker, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {operator ,staker ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSharesIncreasedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for OperatorSharesIncreased here

  const { event, transaction, block, log } = context;
  const { operator, staker, strategy, shares } = event;

  const operatorDb: Instance = bind(Operator);
  const stakerDb: Instance = bind(Staker);

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });
  const stakerData = await stakerDb.findOne({ id: staker.toLowerCase() });

  if (operatorData) {
    const strategyIndex = operatorData.shares.findIndex(
      ({ strategy: sa, shares }: StrategyShares) =>
        sa === strategy.toLowerCase()
    );
    if (strategyIndex !== -1) {
      operatorData.shares[strategyIndex].shares = new BigNumber(
        operatorData.shares[strategyIndex].shares
      )
        .plus(shares)
        .toString();
    } else {
      operatorData.shares.push({
        strategy: strategy.toLowerCase(),
        shares: shares.toString(),
      });
    }
    operatorData.updatedAt = block.block_timestamp;
    operatorData.updatedAtBlock = block.block_number;

    await operatorDb.save(operatorData);
  }

  if (stakerData) {
    const strategyIndex = stakerData.shares.findIndex(
      ({ strategy: sa, shares }: StrategyShares) =>
        sa === strategy.toLowerCase()
    );
    if (strategyIndex !== -1) {
      stakerData.shares[strategyIndex].shares = new BigNumber(
        stakerData.shares[strategyIndex].shares
      )
        .plus(shares)
        .toString();
    } else {
      stakerData.shares.push({
        strategy: strategy.toLowerCase(),
        shares: shares.toString(),
      });
    }
    stakerData.updatedAt = block.block_timestamp;
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  }
};
