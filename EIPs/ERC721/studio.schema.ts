import { String, Array } from "@blockflow-labs/utils";

export interface Transfer {
  id: String; 
  from_address: string;
  to_address: string;
  token_address: string;
  token_id: string;
  transfer_type: string; // mint burn transfer
  transaction_from_address: string;
  transaction_to_address: string;
  transaction_hash: string;
  log_index: string;
  block_timestamp: string;
  block_hash: string;
}

export interface Balance {
  id: String; // user address
  address: string; // user address
  token_address: string;
  balance: string; // total nft it owns
  block_timestamp: string; // last block where any interaction from this add happens
  block_hash: string;
  is_past_holder: boolean; // if this holder had any past nfts 
  is_holder: boolean; // is current holder of any nft?
}

export interface Token {
  id: String;
  address: string;
  holder_count: string;
  burn_event_count: string;
  mint_event_count: string;
  transfer_event_count: string;
  total_supply: string;
  total_burned: string;
  total_minted: string;
  total_transferred: string;
}


