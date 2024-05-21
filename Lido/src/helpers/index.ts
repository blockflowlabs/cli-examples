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
} from "../types/schema";

import {
  CALCULATION_UNIT,
  SECONDS_PER_YEAR,
  ZERO,
  ZERO_ADDRESS,
} from "../constants";
import BigNumber from "bignumber.js";

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
    });

    entity.sender = sender.toString().toLowerCase();
    entity.amount = amount.toString();
    entity.referral = referral.toString().toLowerCase();

    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.transaction_index = transaction.transaction_index;
    entity.log_index = log.log_index;
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
    entity = await lidoTransferDB.create({ id: entityId });
    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.transaction_index = transaction.transaction_index;
    entity.log_index = log.log_index;
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
    entity = await sharesBurnDB.create({ id: entityId });

    entity.account = account.toString().toLowerCase();
    entity.pre_rebase_token_amount = preRebaseTokenAmount.toString();
    entity.post_rebase_token_amount = postRebaseTokenAmount.toString();
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
    entity = await lidoApprovalDB.create({ id: entityId });

    entity.owner = owner.toString().toLowerCase();
    entity.spender = spender.toString().toLowerCase();
    entity.value = value.toString();
  }

  return entity;
};

export const _loadCurrentFeeEntity = async (
  currentFeeDB: Instance,
  context: IEventContext
): Promise<ICurrentFee> => {
  const { event, transaction, block, log } = context;

  let entityId = `lido`;

  let entity: ICurrentFee = await currentFeeDB.findOne({ id: entityId });

  if (!entity) {
    entity = await currentFeeDB.create({ id: entityId });
    entity.fee_basis_points = ZERO;
    entity.treasury_fee_basis_points = ZERO;
    entity.insurance_fee_basis_points = ZERO;
    entity.operators_fee_basis_points = ZERO;
  }

  return entity;
};

export const _loadLidoConfigEntity = async (
  lidoConfigDB: Instance,
  context: IEventContext
): Promise<ILidoConfig> => {
  const { event, transaction, block, log } = context;

  let entityId = `lido`;

  let entity: ILidoConfig = await lidoConfigDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoConfigDB.create({ id: entityId });

    // entity.insurance_fund= ZERO_ADDRESS;
    // entity.oracle= ZERO_ADDRESS;
    // entity.treasury= ZERO_ADDRESS;

    entity.is_stopped = true;
    entity.is_staking_paused = true;

    entity.max_stake_limit = ZERO;
    entity.stake_limit_increase_per_block = ZERO;

    entity.el_rewards_vault = ZERO_ADDRESS;
    entity.el_rewards_withdrawal_limit_points = ZERO;

    entity.withdrawal_credentials = ZERO_ADDRESS;
    entity.wc_set_by = ZERO_ADDRESS;

    entity.lido_locator = ZERO_ADDRESS;
  }

  return entity;
};

export const _loadLidoTotalsEntity = async (
  lidoTotalsDB: Instance,
  context: IEventContext
): Promise<ILidoTotals> => {
  const { event, transaction, block, log } = context;

  let entityId = `lido`;

  let entity: ILidoTotals = await lidoTotalsDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoTotalsDB.create({ id: entityId });
    entity.total_pooled_ether = ZERO;
    entity.total_shares = ZERO;
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
    entity = await lidoSharesDB.create({ id: entityId });
    entity.shares = ZERO;
  }

  return entity;
};

export const _loadLidoStatsEntity = async (
  lidoStatsDB: Instance,
  context: IEventContext
): Promise<ILidoStats> => {
  const { event, transaction, block, log } = context;

  let entityId = `lido`;

  let entity: ILidoStats = await lidoStatsDB.findOne({ id: entityId });

  if (!entity) {
    entity = await lidoStatsDB.create({ id: entityId });
    entity.unique_holders = ZERO;
    entity.unique_anytime_holders = ZERO;
    entity.last_oracle_completed_id = ZERO;
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
    entity = await lidoOracleCompletedDB.create({ id: entityId });
    entity.epoch_id = epochId.toString().toLowerCase();
    entity.beacon_balance = beaconBalance.toString();
    entity.beacon_validators = beaconValidators.toString();

    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.log_index = log.log_index;
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
    entity = await lidoOracleMemberDB.create({ id: entityId });
    entity.member = member.toString().toLowerCase();
    entity.removed = true;
    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.log_index = log.log_index;
  }

  return entity;
};

export const _loadLidoOracleConfigEntity = async (
  lidoOracleConfigDB: Instance
): Promise<ILidoOracleConfig> => {
  let entityId = "lido";

  let entity: ILidoOracleConfig = await lidoOracleConfigDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoOracleConfigDB.create({ id: entityId });

    entity.quorum = ZERO;
    entity.contract_version = ZERO;

    entity.allowed_beacon_balance_annual_relative_increase = ZERO;
    entity.allowed_beacon_balance_relative_decrease = ZERO;

    entity.epochs_per_frame = ZERO;
    entity.slots_per_epoch = ZERO;
    entity.seconds_per_slot = ZERO;
    entity.genesis_time = ZERO;

    entity.beacon_report_receiver = ZERO_ADDRESS;
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
    });
    entity.total_reward = `${transaction.transaction_hash}`.toLowerCase();
    entity.address = to.toString().toLowerCase();
    entity.fee = value.toString();
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

  let stats: ILidoStats = await _loadLidoStatsEntity(lidoStatsDB, context);

  if (transfer.to != ZERO_ADDRESS) {
    let holder: ILidoHolder = await lidoHoldersDB.findOne({ id: transfer.to });
    if (!holder) {
      holder = await lidoHoldersDB.create({ id: transfer.to });
      holder.address = transfer.to;
      holder.has_balance = false;
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
    lidoHoldersDB.save(holder);
  }

  if (transfer.from != ZERO_ADDRESS) {
    let holder: ILidoHolder = await lidoHoldersDB.findOne({
      id: transfer.from,
    });

    if (holder) {
      if (holder.has_balance && transfer.balance_after_decrease == "0") {
        holder.address = transfer.to;
        holder.has_balance = false;
        stats.unique_holders = new BigNumber(stats.unique_holders)
          .minus("1")
          .toString();
      }
      lidoHoldersDB.save(holder);
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
      lidoSharesDB.save(shares);
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
      lidoSharesDB.save(shares);
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
    });
    entity.epoch_id = epochId.toString();
    entity.beacon_balance = beaconBalance.toString();
    entity.beacon_validators = beaconValidators.toString();
    entity.caller = transaction.transaction_from_address.toLowerCase();
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
    entity.epoch_id = epochId.toString();
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
    entity = await lidoNodeOperatorDB.create({ id: entityId });
    entity.name = "";
    entity.reward_address = ZERO_ADDRESS;
    entity.staking_limit = ZERO;
    entity.active = true;

    entity.total_stopped_validators = ZERO;
    entity.total_keys_trimmed = ZERO;
    entity.nonce = ZERO;
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
    entity = await lidoOracleReportDB.create({ id: entityId });
    entity.items_processed = ZERO;
    entity.items_count = ZERO;
  }

  return entity;
};
