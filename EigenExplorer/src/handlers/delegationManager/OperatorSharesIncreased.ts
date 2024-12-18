import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Operator, Staker, Stats, OperatorRestakeHistory } from "../../types/generated";
import BigNumber from "bignumber.js";
import { updateStats } from "../../utils/helpers";
import { stakerDelegatedTopic0, depositTopic0, eigenContracts } from "../../data/constants";

/**
 * @dev Event::OperatorSharesIncreased(address operator, address staker, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {operator ,staker ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSharesIncreasedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for OperatorSharesIncreased here

  const { event, transaction, block, log } = context;
  const { operator, staker, strategy, shares } = event;

  const client = Instance.PostgresClient(bind);

  const operatorDb = client.db(Operator);
  const stakerDb = client.db(Staker);
  const operatorRestakeHistoryDb = client.db(OperatorRestakeHistory);

  const isFollowedByDelegated = transaction.logs.some(
    (log: any) =>
      log.topics[0] === stakerDelegatedTopic0 &&
      log.log_address.toLowerCase() === eigenContracts.DelegationManager.toLowerCase(),
  );

  const isFollowedByDeposit = transaction.logs.some(
    (log: any) =>
      log.topics[0] === depositTopic0 && log.log_address.toLowerCase() === eigenContracts.StrategyManager.toLowerCase(),
  );

  let operatorRestakeType = "undefined";

  switch (true) {
    case isFollowedByDelegated:
      operatorRestakeType = "delegated";
      break;
    case isFollowedByDeposit:
      operatorRestakeType = "deposit";
      break;
    default:
      operatorRestakeType = "undefined";
      break;
  }

  const operatorRestakeHistoryId = `${operator}_${transaction.transaction_hash}_${operatorRestakeType}`.toLowerCase();
  const operatorData = await operatorDb.load({ address: operator.toLowerCase() });
  const stakerData = await stakerDb.load({ address: staker.toLowerCase() });
  const operatorRestakeHistoryData =
    operatorRestakeType !== "undefined"
      ? await operatorRestakeHistoryDb.load({ rowId: operatorRestakeHistoryId })
      : null;

  if (operatorRestakeType !== "undefined") {
    if (!operatorRestakeHistoryData) {
      await operatorRestakeHistoryDb.save({
        rowId: operatorRestakeHistoryId,
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
  }

  if (operatorData) {
    let strategyIndex = operatorData.shares.findIndex(({ strategy: sa }: any) => sa === strategy.toLowerCase());
    if (strategyIndex === -1)
      operatorData.shares.push({
        strategy: strategy.toLowerCase(),
        shares: "0",
      });

    strategyIndex = operatorData.shares.findIndex(({ strategy: sa }: any) => sa === strategy.toLowerCase());

    operatorData.shares[strategyIndex].shares = new BigNumber(operatorData.shares[strategyIndex].shares)
      .plus(shares.toString())
      .toString();

    operatorData.updatedAt = block.block_timestamp;
    operatorData.updatedAtBlock = block.block_number;

    await operatorDb.save(operatorData);
  }

  if (stakerData) {
    let strategyIndex = stakerData.shares.findIndex(({ strategy: sa }: any) => sa === strategy.toLowerCase());

    if (strategyIndex === -1) {
      stakerData.shares.push({
        strategy: strategy.toLowerCase(),
        shares: "0",
      });
    }

    strategyIndex = stakerData.shares.findIndex(({ strategy: sa }: any) => sa === strategy.toLowerCase());

    stakerData.shares[strategyIndex].shares = new BigNumber(stakerData.shares[strategyIndex].shares)
      .plus(shares.toString())
      .toString();

    stakerData.updatedAt = block.block_timestamp;
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  } else {
    await stakerDb.save({
      address: staker.toLowerCase(),
      operator: operator.toLowerCase(),
      shares: [
        {
          strategy: strategy.toLowerCase(),
          shares: shares.toString(),
        },
      ],
      totalWithdrawals: 0,
      totalDeposits: 0,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });

    const statsDb = client.db(Stats);

    await updateStats(statsDb, "totalRegisteredStakers", 1, "add");
    await updateStats(statsDb, "totalActiveStakers", 1, "add");
  }
};
