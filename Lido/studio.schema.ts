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

export interface LidoShares {
  id: String;

  shares: string;
}

export interface LidoOracleConfig {
  id: String;

  quorum: string;
  contract_version: string;
  allowed_beacon_balance_annual_relative_increase: string;
  allowed_beacon_balance_relative_decrease: string;

  epochs_per_frame: string;
  slots_per_epoch: string;
  seconds_per_slot: string;
  genesis_time: string;

  beacon_report_receiver: string;
}

export interface LidoOracleReport {
  id: String;

  total_reward: string;
  hash: string;
  items_processed: string;
  items_count: string;
}

export interface LidoOracleCompleted {
  id: String;

  epoch_id: string;
  beacon_balance: string;
  beacon_validators: string;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface LidoTotalReward {
  id: String;

  total_rewards: string;
  total_rewards_with_fees: string;

  mev_fee: string;

  fee_basis: string;
  treasury_fee_basis_points: string;
  insurance_fee_basis_points: string;
  operators_fee_basis_points: string;

  total_fee: string;
  node_operator_fee: string;
  insurance_fee: string;
  operators_fee: string;
  treasury_fee: string;
  dust: string;

  shares_to_mint: string;

  shares_to_treasury: string;
  shares_to_insurance_fund: string;
  shares_to_operators: string;
  dust_shares_to_treasury: string;

  total_pooled_ether_before: string;
  total_pooled_ether_after: string;
  total_shares_before: string;
  total_shares_after: string;

  time_elapsed: string;

  apr_raw: string;
  apr_before_fees: string;
  apr: string;

  block_timestamp: string;
  transaction_hash: string;
  transaction_index: string;
  log_index: string;
}

export interface LidoOracleMember {
  id: String;

  member: string;
  removed: boolean;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface LidoNodeOperatorFees {
  id: String;

  total_reward: string;

  address: string;
  fee: string;
}

export interface LidoNodeOperatorsShares {
  id: String;
  total_reward: string;
  address: string;
  shares: string;
}

export interface LidoBeaconReport {
  id: String;

  epoch_id: string;
  beacon_balance: string;
  beacon_validators: string;
  caller: string;
}

export interface LidoOracleExpectedEpoch {
  id: String;
  epoch_id: string;
}

export interface LidoAppVersion {
  id: String;
  major: string;
  minor: string;
  patch: string;
  impl: string;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface LidoNodeOperatorSigningKey {
  id: String;
  operator_id: string;
  pubkey: string;
  removed: boolean;

  operator: string;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface LidoNodeOperator {
  id: String;

  name: string;
  reward_address: string;
  staking_limit: string;
  active: boolean;
  total_stopped_validators: string;
  total_keys_trimmed: string;
  nonce: string;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface LidoNodeOperatorKeysOpIndex {
  id: String;

  index: string;
}

export interface VotingConfig {
  id: String;

  support_required_pct: Number;
  min_accept_quorum_pct: Number;
  vote_time: Number;
  objection_phase_time: Number;
}

export interface Voting {
  id: String;

  index: Number;
  creator: string;
  metadata: string;
  executed: boolean;

  votes: [string];
  objections: [string];

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface Vote {
  id: String;

  voting: string;
  voter: string;
  supports: boolean;
  stake: Number;
}

export interface VotingObjection {
  id: String;

  voting: string;
  voter: string;
  stake: Number;
}

export interface WithdrawalQueueConfig {
  id: String;

  is_bunker_mode: boolean;
  bunker_mode_since: Number;
  contract_version: Number;
  is_paused: boolean;
  pause_duration: Number;
}

export interface WithdrawalClaimed {
  id: String;

  request_id: Number;
  owner: string;
  receiver: string;
  amount_of_eth: Number;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface WithdrawalRequested {
  id: String;

  request_id: Number;
  requestor: string;
  owner: string;
  amount_of_StETH: Number;
  amount_of_shares: Number;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface WithdrawalsFinalized {
  id: String;

  from: string;
  to: string;
  amount_of_eth_locked: string;
  shares_to_burn: string;
  timestamp: string;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface Motion {
  id: String;

  creator: string;
  evm_script_factory: string;
  duration: Number;
  start_date: string;
  snapshot_block: Number;
  objections_amount: Number;
  objections_amount_pct: Number;
  objections_threshold: Number;
  evm_script_hash: string;
  evm_script_calldata: string;
  status: string;
  enacted_at: string;
  cancelled_at: string;
  rejected_at: string;

  objections: [string];

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}

export interface EasyTrackConfig {
  id: String;

  evm_script_executor: string;
  motion_duration: Number;
  motions_count_limit: Number;
  objections_threshold: Number;
  is_paused: boolean;
}

export interface Role {
  id: String;

  role: string;
  address: string;
  creator: string;
  is_active: boolean;
}

export interface EVMScriptFactory {
  id: String;

  address: string;
  permissions: string;
  is_active: boolean;
}

export interface Objection {
  id: String;

  motionId: Number;
  objector: string;
  weight: Number;

  motion: string;

  block_timestamp: string;
  transaction_hash: string;
  log_index: string;
}
