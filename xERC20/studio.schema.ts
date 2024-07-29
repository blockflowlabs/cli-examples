import { String } from "@blockflow-labs/utils";

export interface Transfer {
  id: String;
  from_address: string;
  to_address: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  raw_amount: Number;
  raw_amount_str: string;
  amount: Number;
  amount_str: string;
  usd_amount: Number;
  usd_exchange_rate: string;
  transfer_type: string;
  transaction_from_address: string;
  transaction_to_address: string;
  transaction_hash: string;
  log_index: string;
  block_timestamp: string;
  block_hash: string;
}

export interface Balance {
  id: String;
  address: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  balance: string;
  raw_balance: string;
  usd_amount: string;
  usd_exchange_rate: string;
  block_timestamp: string;
  block_hash: string;
  is_past_holder: Boolean;
  is_holder: Boolean;
}

export interface Token {
  id: String;
  address: string;
  decimals: string;
  name: string;
  symbol: string;
  holder_count: string;
  burn_event_count: string;
  mint_event_count: string;
  transfer_event_count: string;
  total_supply: string;
  total_burned: string;
  total_minted: string;
  total_transferred: string;
}

export interface BridgeLimitsSet {
  id: String;
  mintingLimit: Number;
  burningLimit: Number;
  bridge: string;
  block_timestamp: string;
  block_hash: string;
  block_number: string;
}

export interface LockBoxSet {
  id: String;
  lockboxaddress: string;
  block_timestamp: string;
  block_hash: string;
  block_number: string;
}

export interface LockBoxData{
  id: String;
  lockboxaddress: string;
  senderAccount: string;
  depositedAmount: number;
  withdrawnAmount: number;
  netAmount: number;
}
