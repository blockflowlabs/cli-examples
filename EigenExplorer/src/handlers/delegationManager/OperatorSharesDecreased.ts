import { IEventContext, IBind, Instance, ISecrets, ILog } from "@blockflow-labs/utils";
import BigNumber from "bignumber.js";
import { Operator, Staker, StrategyShares, Stats, OperatorRestakeHistory } from "../../types/schema";
import { updateStats } from "../../utils/helpers";
import { eigenContracts, stakerUndelegatedTopic0 } from "../../data/constants";

/**
 * @dev Event::OperatorSharesDecreased(address operator, address staker, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {operator ,staker ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSharesDecreasedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for OperatorSharesDecreased here

  const { event, transaction, block, log } = context;
  const { operator, staker, strategy, shares } = event;

  const operatorDb: Instance = bind(Operator);
  const stakerDb: Instance = bind(Staker);
  const operatorRestakeHistoryDb: Instance = bind(OperatorRestakeHistory);

  const isFollowedByUndelegated = transaction.logs.some(
    (log: ILog) =>
      log.topics[0] === stakerUndelegatedTopic0 &&
      log.log_address.toLowerCase() === eigenContracts.DelegationManager.toLowerCase(),
  );

  const operatorRestakeType = isFollowedByUndelegated ? "undelegated" : "withdraw";

  const operatorRestakeHistoryId = `${operator}_${transaction.transaction_hash}_${operatorRestakeType}`.toLowerCase();

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });
  const stakerData = await stakerDb.findOne({ id: staker.toLowerCase() });
  const operatorRestakeHistoryData = await operatorRestakeHistoryDb.findOne({ id: operatorRestakeHistoryId });

  if (!operatorRestakeHistoryData) {
    await operatorRestakeHistoryDb.create({
      id: operatorRestakeHistoryId,
      operatorAddress: operator.toLowerCase(),
      stakerAddress: staker.toLowerCase(),
      transactionHash: transaction.transaction_hash,
      shares: [{ strategy: strategy.toLowerCase(), shares: shares.toString() }],
      action: operatorRestakeType,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  } else {
    operatorRestakeHistoryData.shares.push({ strategy: strategy.toLowerCase(), shares: shares.toString() });
    operatorRestakeHistoryData.updatedAt = block.block_timestamp;
    operatorRestakeHistoryData.updatedAtBlock = block.block_number;

    await operatorRestakeHistoryDb.save(operatorRestakeHistoryData);
  }

  if (operatorData) {
    const strategyIndex = operatorData.shares.findIndex(
      ({ strategy: sa }: StrategyShares) => sa === strategy.toLowerCase(),
    );

    if (strategyIndex !== -1) {
      operatorData.shares[strategyIndex].shares = new BigNumber(operatorData.shares[strategyIndex].shares)
        .minus(shares.toString())
        .toString();
      operatorData.updatedAt = block.block_timestamp;
      operatorData.updatedAtBlock = block.block_number;

      await operatorDb.save(operatorData);
    }
  }

  if (stakerData) {
    const strategyIndex = stakerData.shares.findIndex(
      ({ strategy: sa }: StrategyShares) => sa === strategy.toLowerCase(),
    );

    if (strategyIndex !== -1) {
      const strategyShares = new BigNumber(stakerData.shares[strategyIndex].shares);
      stakerData.shares[strategyIndex].shares = strategyShares.isGreaterThanOrEqualTo(shares.toString())
        ? strategyShares.minus(shares.toString()).toString()
        : "0";
      stakerData.updatedAt = block.block_timestamp;
      stakerData.updatedAtBlock = block.block_number;

      await stakerDb.save(stakerData);
    } else {
      stakerData.shares.push({
        strategy: strategy.toLowerCase(),
        shares: "0",
      });

      await stakerDb.save(stakerData);
    }
  } else {
    await stakerDb.create({
      id: staker.toLowerCase(),
      address: staker.toLowerCase(),
      operator: operator.toLowerCase(),
      shares: [
        {
          strategy: strategy.toLowerCase(),
          shares: "0",
        },
      ],
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });

    const statsDb: Instance = bind(Stats);

    await updateStats(statsDb, "totalRegisteredStakers", 1, "add");
    await updateStats(statsDb, "totalActiveStakers", 1, "add");
  }
};
