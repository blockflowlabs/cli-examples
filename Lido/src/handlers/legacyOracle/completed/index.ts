import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  ILidoConfig,
  ILidoOracleCompleted,
  ILidoStats,
  ILidoBeaconReport,
  LidoConfig,
  LidoOracleCompleted,
  LidoStats,
  LidoBeaconReport,
  ILidoOracleExpectedEpoch,
  LidoOracleExpectedEpoch,
  LidoTotals,
  ILidoTotals,
  LidoTotalReward,
  ILidoTotalReward,
  CurrentFee,
  ICurrentFee,
} from "../../../types/schema";

import {
  _loadLidoConfigEntity,
  _loadLidoOracleCompletedEntity,
  _loadLidoStatsEntity,
  _loadLidoBeaconReportEntity,
  _loadLidoOracleExpectedEpochEntity,
  _loadLidoTotalsEntity,
  _loadLidoTotalRewardEntity,
  _loadCurrentFeeEntity,
  _calcAPR_v1,
} from "../../../helpers";

import BigNumber from "bignumber.js";
import {
  CALCULATION_UNIT,
  DEPOSIT_AMOUNT,
  EL_REWARDS_TOPIC0,
  MEV_TX_FEE_RECIEVED_TOPIC0,
  PROTOCOL_UPG_BLOCKS,
  ZERO,
} from "../../../constants";
import {
  decodeELRewardsEvent,
  decodeMevTxFeeReceivedEvent,
} from "../../../utils";

/**
 * @dev Event::Completed(uint256 epochId, uint128 beaconBalance, uint128 beaconValidators)
 * @param context trigger object with contains {event: {epochId ,beaconBalance ,beaconValidators }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const CompletedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Completed here

  const { event, transaction, block, log } = context;
  const { epochId, beaconBalance, beaconValidators } = event;

  const lidoStatsDB = bind(LidoStats);
  const lidoOracleCompletedDB = bind(LidoOracleCompleted);

  const stats: ILidoStats = await _loadLidoStatsEntity(lidoStatsDB, context);

  let previousCompletedOracleId = stats.last_oracle_completed_id.toString();

  let newCompletedOracleId = new BigNumber(previousCompletedOracleId)
    .plus("1")
    .toString();

  stats.last_oracle_completed_id = newCompletedOracleId;

  const previousCompletedOracle: ILidoOracleCompleted =
    await _loadLidoOracleCompletedEntity(
      lidoOracleCompletedDB,
      context,
      previousCompletedOracleId,
    );

  const newCompletedOracle: ILidoOracleCompleted =
    await _loadLidoOracleCompletedEntity(
      lidoOracleCompletedDB,
      context,
      newCompletedOracleId,
    );

  await lidoStatsDB.save(stats);

  await lidoOracleCompletedDB.save(newCompletedOracle);

  const lidoConfigDB: Instance = bind(LidoConfig);

  let config: ILidoConfig = await _loadLidoConfigEntity(lidoConfigDB, context);

  const lidoBeaconReportDB: Instance = bind(LidoBeaconReport);

  let beaconReport: ILidoBeaconReport = await _loadLidoBeaconReportEntity(
    lidoConfigDB,
    context,
  );

  await lidoBeaconReportDB.save(beaconReport);

  const lidoOracleExpectedEpochDB: Instance = bind(LidoOracleExpectedEpoch);

  let oracleExpectedEpoch: ILidoOracleExpectedEpoch =
    await _loadLidoOracleExpectedEpochEntity(lidoConfigDB, context);

  await lidoOracleExpectedEpochDB.save(oracleExpectedEpoch);

  let isLidoV2 = block.block_number > PROTOCOL_UPG_BLOCKS["V2"];

  if (isLidoV2) {
    return;
  }

  const oldBeaconValidators = previousCompletedOracle
    ? previousCompletedOracle.beacon_validators
    : ZERO;

  const oldBeaconBalance = previousCompletedOracle
    ? previousCompletedOracle.beacon_balance
    : ZERO;

  const newBeaconValidators = beaconValidators.toString();

  const newBeaconBalance = beaconBalance.toString();

  const appearedValidators = new BigNumber(newBeaconValidators)
    .minus(oldBeaconValidators)
    .toString();

  const appearedValidatorsDeposits =
    appearedValidators > ZERO
      ? new BigNumber(appearedValidators).times(DEPOSIT_AMOUNT).toString()
      : ZERO;

  const rewardBase = new BigNumber(appearedValidatorsDeposits)
    .plus(oldBeaconBalance)
    .toString();

  const isELRewardsEvent = transaction
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === EL_REWARDS_TOPIC0,
      )
    : null;

  const isMevTxFeeEvent = transaction
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === MEV_TX_FEE_RECIEVED_TOPIC0,
      )
    : null;

  const elRewardsEvent: any = decodeELRewardsEvent(isELRewardsEvent);

  const mevTxFeeEvent: any = decodeMevTxFeeReceivedEvent(isMevTxFeeEvent);

  const mevFee = isELRewardsEvent
    ? elRewardsEvent.params.amount
    : isMevTxFeeEvent
      ? mevTxFeeEvent.params.amount
      : ZERO;

  let rewards = new BigNumber(newBeaconBalance)
    .minus(rewardBase)
    .plus(mevFee)
    .toString();

  const lidoTotalsDB: Instance = bind(LidoTotals);

  const totals: ILidoTotals = await _loadLidoTotalsEntity(
    lidoTotalsDB,
    context,
  );

  let totalPooledEtherBefore = totals.total_pooled_ether;
  // pre-calculation
  let totalPooledEtherAfter = new BigNumber(totalPooledEtherBefore)
    .plus(rewards)
    .toString();

  totals.total_pooled_ether = totalPooledEtherAfter;

  if (newBeaconBalance <= rewardBase) {
    lidoTotalsDB.save(totals);
    return;
  }

  const lidoTotalRewardDB: Instance = bind(LidoTotalReward);

  let totalReward: ILidoTotalReward = await _loadLidoTotalRewardEntity(
    lidoTotalRewardDB,
    context,
  );

  totalReward.total_shares_before = totals.total_shares;
  totalReward.total_pooled_ether_before = totalPooledEtherBefore;
  totalReward.total_pooled_ether_after = totalPooledEtherAfter;

  totalReward.mev_fee = mevFee;

  totalReward.total_rewards_with_fees = rewards;
  totalReward.total_rewards = rewards;

  const currentFeeDB: Instance = bind(CurrentFee);

  let currentFee: ICurrentFee = await _loadCurrentFeeEntity(
    currentFeeDB,
    context,
  );

  const shares2mint = new BigNumber(rewards)
    .times(currentFee.fee_basis_points)
    .times(totals.total_shares) // totalSharesBefore
    .div(
      new BigNumber(totalPooledEtherAfter)
        .times(CALCULATION_UNIT)
        .minus(new BigNumber(currentFee.fee_basis_points).times(rewards)),
    )
    .toString();

  totals.total_shares = new BigNumber(totals.total_shares)
    .plus(shares2mint)
    .toString();
  lidoTotalsDB.save(totals);

  totalReward.total_shares_after = totals.total_shares;

  totalReward.fee_basis = currentFee.fee_basis_points;
  totalReward.treasury_fee_basis_points = currentFee.treasury_fee_basis_points;
  totalReward.insurance_fee_basis_points =
    currentFee.insurance_fee_basis_points;
  totalReward.operators_fee_basis_points =
    currentFee.operators_fee_basis_points;

  const sharesToInsuranceFund = new BigNumber(shares2mint)
    .times(totalReward.insurance_fee_basis_points)
    .div(CALCULATION_UNIT);

  const sharesToOperators = new BigNumber(shares2mint)
    .times(totalReward.operators_fee_basis_points)
    .div(CALCULATION_UNIT);

  totalReward.shares_to_mint = shares2mint;
  totalReward.shares_to_insurance_fund = sharesToInsuranceFund.toString();
  totalReward.shares_to_operators = sharesToOperators.toString();

  let sharesToOperatorsActual = ZERO;

  //have to add node operator fee registry code

  let treasuryShares = new BigNumber(shares2mint)
    .minus(sharesToInsuranceFund)
    .minus(sharesToOperatorsActual);

  if (totalReward.treasury_fee_basis_points == "0") {
    totalReward.shares_to_treasury = ZERO;
    totalReward.dust_shares_to_treasury = treasuryShares.toString();
  } else {
    totalReward.shares_to_treasury = treasuryShares.toString();
    totalReward.dust_shares_to_treasury = ZERO;
  }

  const timeElapsed = previousCompletedOracle
    ? new BigNumber(newCompletedOracle.block_timestamp).minus(
        previousCompletedOracle.block_timestamp,
      )
    : ZERO;

  totalReward.time_elapsed = timeElapsed.toString();

  let updatedTotalReward = _calcAPR_v1(
    totalReward,
    totalReward.total_pooled_ether_before,
    totalReward.total_pooled_ether_after,
    totalReward.time_elapsed,
    totalReward.fee_basis,
  );

  lidoTotalRewardDB.save(updatedTotalReward);
};
