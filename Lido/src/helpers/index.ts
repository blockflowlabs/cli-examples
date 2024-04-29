import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  ILidoSubmission,
  ILidoTransfer,
  ISharesBurn,
  ILidoApproval,
  ICurrentFee,
  ILidoConfig,
  ILidoTotals,
} from "../types/schema";

import { ZERO, ZERO_ADDRESS } from "../constants";

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
  const { from, to, value } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoTransfer = await lidoTransferDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await lidoTransferDB.create({ id: entityId });

    entity.from = from.toString().toLowerCase();
    entity.to = to.toString().toLowerCase();
    entity.value = value.toString();

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
    entity.total_pooled_ether = ZERO;
  }

  return entity;
};
