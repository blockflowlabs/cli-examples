import { String } from "@blockflow-labs/utils";

export interface Batch {
  id: String;
  batch_id: string;
  batch_header_hash: string;
  batch_header: string;
  non_signing: string;
  gas_fees: string;
  block_timestamp: string;
  transaction_hash: string;
}

export interface GasFees {
  id: String;
  gas_used: string;
  gas_price: string;
  transaction_fee: string;
}

export interface BatchHeader {
  id: String;
  blob_headers_root: string;
  quorum_numbers: [string];
  signed_stake_for_quorums: [string];
  reference_blocknumber: string;
  batch: string;
}

export interface NonSigning {
  id: String;
  non_signers: [string];
  batch: string;
  signatory_record_hash: string;
}

export interface Operator {
  id: string;
  operator_id: string;
  non_signings: [string];
}
