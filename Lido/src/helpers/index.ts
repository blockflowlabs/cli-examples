import { IBind, IEventContext, Instance } from "@blockflow-labs/utils";

import {
  ILidoSubmission,
  ILidoTransfer,
  ISharesBurn,
  ILidoApproval,
  ICurrentFee,
  ILidoConfig,
  ILidoTotals,
  ILidoStats,
  ILidoOracleCompleted,
  ILidoOracleMember,
  ILidoOracleConfig,
  ILidoShares,
  ILidoTotalReward,
  ILidoNodeOperatorFees,
  ILidoNodeOperatorsShares,
  LidoTransfer,
  LidoStats,
  ILidoHolder,
  LidoHolder,
  LidoShares,
  ILidoBeaconReport,
  ILidoOracleExpectedEpoch,
  ILidoNodeOperator,
  IVotingConfig,
  ILidoOracleReport,
  IWithdrawalQueueConfig,
  IEasyTrackConfig,
} from "../types/schema";

import {
  CALCULATION_UNIT,
  SECONDS_PER_YEAR,
  ZERO,
  ZERO_ADDRESS,
} from "../constants";
import BigNumber from "bignumber.js";
import { ZeroAddress } from "ethers";

export const _loadLidoSubmissionEntity = async (
  lidoSubmissionDB: Instance,
  context: IEventContext
): Promise<ILidoSubmission> => {
  const { event, transaction, block, log } = context;
  const { sender, amount, referral } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoSubmission = await lidoSubmissionDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoSubmissionDB.create({
      id: entityId,
      sender: sender.toString().toLowerCase(),
      amount: amount.toString(),
      referral: referral.toString().toLowerCase(),

      shares: "0",
      shares_before: "0",
      shares_after: "0",

      total_pooled_ether_before: "0",
      total_pooled_ether_after: "0",

      total_shares_before: "0",
      total_shares_after: "0",

      balance_after: "0",

      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
      transaction_index: transaction.transaction_index,
      log_index: log.log_index,
    });
  }

  return entity;
};

export const _loadLidoTransferEntity = async (
  lidoTransferDB: Instance,
  context: IEventContext
): Promise<ILidoTransfer> => {
  const { event, transaction, block, log } = context;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoTransfer = await lidoTransferDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoTransferDB.create({
      id: entityId,
      from: ZeroAddress,
      to: ZeroAddress,
      value: "0",

      shares: "0",
      shares_before_decrease: "0",
      shares_after_decrease: "0",
      shares_before_increase: "0",
      shares_after_increase: "0",

      total_pooled_ether: "0",
      total_shares: "0",

      balance_after_decrease: "0",
      balance_after_increase: "0",
      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
      transaction_index: transaction.transaction_index,
      log_index: log.log_index,
    });
  }

  return entity;
};

export const _loadSharesBurnEntity = async (
  sharesBurnDB: Instance,
  context: IEventContext
): Promise<ISharesBurn> => {
  const { event, transaction, block, log } = context;
  const { account, preRebaseTokenAmount, postRebaseTokenAmount, sharesAmount } =
    event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ISharesBurn = await sharesBurnDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await sharesBurnDB.create({
      id: entityId,
      account: account.toString().toLowerCase(),
      post_rebase_token_amount: preRebaseTokenAmount.toString(),
      pre_rebase_token_amount: postRebaseTokenAmount.toString(),
      shares_amount: sharesAmount.toString(),
    });
  }

  return entity;
};

export const _loadLidoApprovalEntity = async (
  lidoApprovalDB: Instance,
  context: IEventContext
): Promise<ILidoApproval> => {
  const { event, transaction, block, log } = context;
  const { owner, spender, value } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoApproval = await lidoApprovalDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoApprovalDB.create({
      id: entityId,
      owner: owner.toString().toLowerCase(),
      spender: spender.toString().toLowerCase(),
      value: value.toString(),
    });
  }

  return entity;
};

export const _loadCurrentFeeEntity = async (
  currentFeeDB: Instance
): Promise<ICurrentFee> => {
  let entityId = `lidocurrentfee`;

  let entity: ICurrentFee = await currentFeeDB.findOne({ id: entityId });

  if (!entity) {
    entity = await currentFeeDB.create({
      id: entityId,
      fee_basis_points: "0",
      treasury_fee_basis_points: "0",
      insurance_fee_basis_points: "0",
      operators_fee_basis_points: "0",
    });
  }

  return entity;
};

export const _loadLidoConfigEntity = async (
  lidoConfigDB: Instance
): Promise<ILidoConfig> => {
  let entityId = `lidoconfig`;

  let entity: ILidoConfig = await lidoConfigDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoConfigDB.create({
      id: entityId,
      insurance_fund: ZeroAddress,
      oracle: ZeroAddress,
      treasury: ZeroAddress,

      is_stopped: true,
      is_staking_paused: true,

      max_stake_limit: "0",
      stake_limit_increase_per_block: "0",

      el_rewards_vault: ZeroAddress,
      el_rewards_withdrawal_limit_points: "0",

      withdrawal_credentials: ZeroAddress,
      wc_set_by: ZeroAddress,
      lido_locator: ZeroAddress,
    });
  }

  return entity;
};

export const _loadLidoTotalsEntity = async (
  lidoTotalsDB: Instance
): Promise<ILidoTotals> => {
  let entityId = `lidototal`;

  let entity: ILidoTotals = await lidoTotalsDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoTotalsDB.create({
      id: entityId,
      total_pooled_ether: "0",
      total_shares: "0",
    });
  }

  return entity;
};

export const _loadLidoSharesEntity = async (
  lidoSharesDB: Instance,
  userId: string
): Promise<ILidoShares> => {
  let entityId = userId.toString().toLowerCase();

  let entity: ILidoShares = await lidoSharesDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoSharesDB.create({ id: entityId, shares: "0" });
  }

  return entity;
};

export const _loadLidoStatsEntity = async (
  lidoStatsDB: Instance
): Promise<ILidoStats> => {
  let entityId = `lidostats`;

  let entity: ILidoStats = await lidoStatsDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoStatsDB.create({
      id: entityId,
      unique_holders: "0",
      unique_anytime_holders: "0",
      last_oracle_completed_id: "0",
    });
  }

  return entity;
};

export const _loadLidoOracleCompletedEntity = async (
  lidoOracleCompletedDB: Instance,
  context: IEventContext,
  oracleCompletedId: string
): Promise<ILidoOracleCompleted> => {
  const { event, transaction, block, log } = context;
  const { epochId, beaconBalance, beaconValidators } = event;

  let entityId = oracleCompletedId;

  let entity: ILidoOracleCompleted = await lidoOracleCompletedDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoOracleCompletedDB.create({
      id: entityId,
      epoch_id: epochId.toString().toLowerCase(),
      beacon_balance: beaconBalance.toString(),
      beacon_validators: beaconValidators.toString(),

      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
      log_index: log.log_index,
    });
  }

  return entity;
};

export const _loadLidoOracleMemberEntity = async (
  lidoOracleMemberDB: Instance,
  context: IEventContext
): Promise<ILidoOracleMember> => {
  const { event, transaction, block, log } = context;
  const { member } = event;

  let entityId = member.toString().toLowerCase();

  let entity: ILidoOracleMember = await lidoOracleMemberDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoOracleMemberDB.create({
      id: entityId,
      member: member.toString().toLowerCase(),
      removed: true,

      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
      log_index: log.log_index,
    });
  }

  return entity;
};

export const _loadLidoOracleConfigEntity = async (
  lidoOracleConfigDB: Instance
): Promise<ILidoOracleConfig> => {
  let entityId = "lidooracleconfig";

  let entity: ILidoOracleConfig = await lidoOracleConfigDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoOracleConfigDB.create({
      id: entityId,
      quorum: "0",
      contract_version: "0",
      allowed_beacon_balance_annual_relative_increase: "0",
      allowed_beacon_balance_relative_decrease: "0",

      epochs_per_frame: "0",
      slots_per_epoch: "0",
      seconds_per_slot: "0",
      genesis_time: "0",

      beacon_report_receiver: ZeroAddress,
    });
  }
  return entity;
};

export const _loadLidoTotalRewardEntity = async (
  lidoTotalRewardDB: Instance,
  context: IEventContext
): Promise<ILidoTotalReward> => {
  const { event, transaction, block, log } = context;
  let entityId = `${transaction.transaction_hash}`.toLowerCase();

  let entity: ILidoTotalReward = await lidoTotalRewardDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoTotalRewardDB.create({
      id: entityId,

      total_rewards: "0",
      total_rewards_with_fees: "0",

      mev_fee: "0",

      fee_basis: "0",
      treasury_fee_basis_points: "0",
      insurance_fee_basis_points: "0",
      operators_fee_basis_points: "0",

      total_fee: "0",
      node_operator_fee: "0",
      insurance_fee: "0",
      operators_fee: "0",
      treasury_fee: "0",
      dust: "0",

      shares_to_mint: "0",

      shares_to_treasury: "0",
      shares_to_insurance_fund: "0",
      shares_to_operators: "0",
      dust_shares_to_treasury: "0",

      total_pooled_ether_before: "0",
      total_pooled_ether_after: "0",
      total_shares_before: "0",
      total_shares_after: "0",

      time_elapsed: "0",

      apr_raw: "0",
      apr_before_fees: "0",
      apr: "0",

      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
      transaction_index: transaction.transaction_index,
      log_index: log.log_index,
    });
  }

  return entity;
};

export const _loadLidoNodeOperatorFeesEntity = async (
  lidoNodeOperatorFeesDB: Instance,
  context: IEventContext
): Promise<ILidoNodeOperatorFees> => {
  const { event, transaction, block, log } = context;
  const { from, to, value } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoNodeOperatorFees = await lidoNodeOperatorFeesDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoNodeOperatorFeesDB.create({
      id: entityId,
      total_reward: `${transaction.transaction_hash}`.toLowerCase(),
      address: to.toString().toLowerCase(),
      fee: value.toString(),
    });
  }

  return entity;
};

export const _loadLidoNodeOperatorsSharesEntity = async (
  lidoNodeOperatorsSharesDB: Instance,
  context: IEventContext
): Promise<ILidoNodeOperatorsShares> => {
  const { event, transaction, block, log } = context;
  const { from, to, value } = event;

  let entityId =
    `${transaction.transaction_hash}:${to.toString()}`.toLowerCase();

  let entity: ILidoNodeOperatorsShares =
    await lidoNodeOperatorsSharesDB.findOne({
      id: entityId,
    });

  if (!entity) {
    entity = await lidoNodeOperatorsSharesDB.create({
      id: entityId,
      total_reward: "0",
      address: ZeroAddress,
      shares: "0",
    });
  }

  return entity;
};

export const _updateHolders = async (
  transfer: ILidoTransfer,
  context: IEventContext,
  bind: IBind
): Promise<void> => {
  const lidoStatsDB: Instance = bind(LidoStats);
  const lidoHoldersDB: Instance = bind(LidoHolder);

  let stats: ILidoStats = await _loadLidoStatsEntity(lidoStatsDB);

  if (transfer.to != ZERO_ADDRESS) {
    let holder: ILidoHolder = await lidoHoldersDB.findOne({
      id: transfer.to.toString().toLowerCase(),
    });

    if (!holder) {
      holder = await lidoHoldersDB.create({
        id: transfer.to.toString().toLowerCase(),
        address: transfer.to.toString().toLowerCase(),
        has_balance: false,
      });

      stats.unique_anytime_holders = new BigNumber(stats.unique_anytime_holders)
        .plus("1")
        .toString();
    }
    if (!holder.has_balance) {
      holder.has_balance = true;
      stats.unique_holders = new BigNumber(stats.unique_holders)
        .plus("1")
        .toString();
    }
    await lidoHoldersDB.save(holder);
  }

  if (transfer.from != ZERO_ADDRESS) {
    let holder: ILidoHolder = await lidoHoldersDB.findOne({
      id: transfer.from.toString().toLowerCase(),
    });

    if (holder) {
      if (holder.has_balance && transfer.balance_after_decrease == "0") {
        holder.address = transfer.to;
        holder.has_balance = false;
        stats.unique_holders = new BigNumber(stats.unique_holders)
          .minus("1")
          .toString();
      }
      await lidoHoldersDB.save(holder);
    }
  }
  await lidoStatsDB.save(stats);
};

export const _updateTransferBalances = async (
  transfer: ILidoTransfer
): Promise<ILidoTransfer> => {
  if (transfer.total_shares == "0") {
    transfer.balance_after_increase = transfer.value;
    transfer.balance_after_decrease = ZERO;
  } else {
    transfer.balance_after_increase = new BigNumber(
      transfer.shares_after_increase
    )
      .times(transfer.total_pooled_ether)
      .div(transfer.total_shares)
      .toString();

    transfer.balance_after_decrease = new BigNumber(
      transfer.shares_after_decrease
    )
      .times(transfer.total_pooled_ether)
      .div(transfer.total_shares)
      .toString();
  }

  return transfer;
};

export const _updateTransferShares = async (
  transfer: ILidoTransfer,
  bind: IBind
): Promise<ILidoTransfer> => {
  let lidoSharesDB: Instance = bind(LidoShares);

  if (transfer.from != "ZERO_ADDRESSES") {
    let shares = await _loadLidoSharesEntity(lidoSharesDB, transfer.from);

    transfer.shares_before_decrease = shares.shares;
    if (transfer.to != transfer.from && !(transfer.shares == "0")) {
      shares.shares = new BigNumber(shares.shares)
        .minus(transfer.shares)
        .toString();
      await lidoSharesDB.save(shares);
    }
    transfer.shares_after_decrease = shares.shares;
  }

  if (transfer.to != ZERO_ADDRESS) {
    let shares = await _loadLidoSharesEntity(lidoSharesDB, transfer.to);

    transfer.shares_before_increase = shares.shares;
    if (transfer.to != transfer.from && !(transfer.shares == "0")) {
      shares.shares = new BigNumber(shares.shares)
        .plus(transfer.shares)
        .toString();
      await lidoSharesDB.save(shares);
    }
    transfer.shares_after_increase = shares.shares;
  }

  return transfer;
};

export const _loadLidoBeaconReportEntity = async (
  lidoBeaconReportDB: Instance,
  context: IEventContext
): Promise<ILidoBeaconReport> => {
  const { event, transaction, block, log } = context;
  const { epochId, beaconBalance, beaconValidators } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoBeaconReport = await lidoBeaconReportDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoBeaconReportDB.create({
      id: entityId,
      epoch_id: epochId.toString(),
      beacon_balance: beaconBalance.toString(),
      beacon_validators: beaconValidators.toString(),
      caller: transaction.transaction_from_address.toLowerCase(),
    });
  }

  return entity;
};

export const _loadLidoOracleExpectedEpochEntity = async (
  lidoOracleExpectedEpochDB: Instance,
  context: IEventContext
): Promise<ILidoOracleExpectedEpoch> => {
  const { event, transaction, block, log } = context;
  const { epochId, beaconBalance, beaconValidators } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoOracleExpectedEpoch =
    await lidoOracleExpectedEpochDB.findOne({
      id: entityId,
    });

  if (!entity) {
    entity = await lidoOracleExpectedEpochDB.create({
      id: entityId,
    });
  }

  return entity;
};

export function _calcAPR_v1(
  entity: ILidoTotalReward,
  preTotalPooledEther: string,
  postTotalPooledEther: string,
  timeElapsed: string,
  feeBasis: string
): ILidoTotalReward {
  entity.apr_raw = new BigNumber(postTotalPooledEther)
    .div(preTotalPooledEther)
    .minus("1")
    .times("100")
    .times("365")
    .toString();

  // Time-compensated APR
  // (postTotalPooledEther - preTotalPooledEther) * secondsInYear / (preTotalPooledEther * timeElapsed)
  entity.apr_before_fees =
    timeElapsed == "0"
      ? entity.apr_raw
      : new BigNumber(postTotalPooledEther)
          .minus(preTotalPooledEther)
          .times(SECONDS_PER_YEAR)
          .div(new BigNumber(preTotalPooledEther).times(timeElapsed))
          .times("100")
          .toString();

  // Subtracting fees
  entity.apr = new BigNumber(entity.apr_before_fees)
    .minus(
      new BigNumber(entity.apr_before_fees)
        .times(CALCULATION_UNIT)
        .div(feeBasis)
        .div("100")
    )
    .toString();

  return entity;
}

export const _loadLidoNodeOperatorEntity = async (
  lidoNodeOperatorDB: Instance,
  operatorId: string,
  create: boolean = false
): Promise<ILidoNodeOperator> => {
  let entityId = operatorId.toString().toLowerCase();

  let entity: ILidoNodeOperator = await lidoNodeOperatorDB.findOne({
    id: entityId,
  });

  if (!entity && create) {
    entity = await lidoNodeOperatorDB.create({
      id: entityId,
      name: "",
      reward_address: ZeroAddress,
      staking_limit: "0",
      active: true,
      total_stopped_validators: "0",
      total_keys_trimmed: "0",
      nonce: "0",
    });
  }

  return entity;
};

export const _loadVotingConfigEntity = async (
  votingConfigDB: Instance
): Promise<IVotingConfig> => {
  let entityId = "lido";

  let entity: IVotingConfig = await votingConfigDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await votingConfigDB.create({ id: entityId });

    entity.support_required_pct = Number(ZERO);
    entity.min_accept_quorum_pct = Number(ZERO);
    entity.vote_time = Number(ZERO);

    entity.objection_phase_time = Number(ZERO);
  }

  return entity;
};

export const _loadLidoOracleReportEntity = async (
  lidoOracleReportDB: Instance,
  context: IEventContext,
  create: boolean = false
): Promise<ILidoOracleReport> => {
  const { event, transaction, block, log } = context;
  const { refSlot } = event;

  let entityId = refSlot.toString();

  let entity: ILidoOracleReport = await lidoOracleReportDB.findOne({
    id: entityId,
  });

  if (!entity && create) {
    entity = await lidoOracleReportDB.create({
      id: entityId,
      total_reward: "",
      hash: "",
      items_processed: "0",
      items_count: "0",
    });
  }

  return entity;
};

export const _loadWithdrawalQueueConfigEntity = async (
  withdrawalQueueConfigDB: Instance
): Promise<IWithdrawalQueueConfig> => {
  let entityId = "lido";

  let entity: IWithdrawalQueueConfig = await withdrawalQueueConfigDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await withdrawalQueueConfigDB.create({ id: entityId });
    entity.is_bunker_mode = false;
    entity.bunker_mode_since = Number(ZERO);
    entity.contract_version = Number(ZERO);
    entity.is_paused = true;
    entity.pause_duration = Number(ZERO);
  }

  return entity;
};

export const _loadEasyTrackConfigEntity = async (
  easyTrackConfigDB: Instance
): Promise<IEasyTrackConfig> => {
  let entityId = "lidoeasytrackconfig";

  let entity: IEasyTrackConfig = await easyTrackConfigDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await easyTrackConfigDB.create({
      id: entityId,
      evm_script_executor: ZeroAddress,
      motion_duration: 0,
      motions_count_limit: 0,
      objections_threshold: 0,
      is_paused: false,
    });
  }

  return entity;
};
