import { String, Array } from "@blockflow-labs/utils";

export interface LidoSubmission {
  id: String;

  sender: string;
  amount: string;
  referral: string;

  shares: string;
  shares_before: string;
  shares_after: string;

  total_pooled_ether_before: string;
  total_pooled_ether_after: string;

  total_shares_before: string;
  total_shares_after: string;

  balance_after: string;

  block_timestamp: string;
  transaction_hash: string;
  transaction_index: string;
  log_index: string;
}

export interface LidoTransfer {
  id: String;

  from: string;
  to: string;
  value: string;

  shares: string;
  shares_before_decrease: string;
  shares_after_decrease: string;
  shares_before_increase: string;
  shares_after_increase: string;

  total_pooled_ether: string;
  total_shares: string;

  balance_after_decrease: string;
  balance_after_increase: string;

  block_timestamp: string;
  transaction_hash: string;
  transaction_index: string;
  log_index: string;
}

export interface SharesBurn {
  id: String;

  account: string;
  post_rebase_token_amount: string;
  pre_rebase_token_amount: string;
  shares_amount: string;
}

export interface LidoApproval {
  id: String;

  owner: string;
  spender: string;
  value: string;
}

export interface CurrentFee {
  id: String;

  fee_basis_points: string;
  treasury_fee_basis_points: string;
  insurance_fee_basis_points: string;
  operators_fee_basis_points: string;
}

export interface LidoConfig {
  id: String;

  insurance_fund: string;
  oracle: string;
  treasury: string;

  is_stopped: boolean;
  is_staking_paused: boolean;

  max_stake_limit: string;
  stake_limit_increase_per_block: string;

  el_rewards_vault: string;
  el_rewards_withdrawal_limit_points: string;

  withdrawal_credentials: string;
  wc_set_by: string;
  lido_locator: string;
}

export interface LidoTotals {
  id: String;

  total_pooled_ether: string;
  total_shares: string;
}

export interface LidoStats {
  id: String;

  unique_holders: string;
  unique_anytime_holders: string;
  last_oracle_completed_id: string;
}

export interface LidoHolder {
  id: String;

  address: string;
  has_balance: boolean;
}
