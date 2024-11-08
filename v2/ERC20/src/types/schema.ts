export const Transfer = {
  "name": "XXXX-XXXX-XXXX-XXXX-Transfer",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "from_address": "string?",
    "to_address": "string?",
    "token_address": "string?",
    "token_name": "string?",
    "token_symbol": "string?",
    "raw_amount": "string?",
    "transfer_type": "string?",
    "transaction_from_address": "string?",
    "transaction_to_address": "string?",
    "transaction_hash": "string?",
    "log_index": "string?",
    "block_timestamp": "string?"
  },
  "reorg": true
};

export interface ITransfer {
  from_address?: string;
  to_address?: string;
  token_address?: string;
  token_name?: string;
  token_symbol?: string;
  raw_amount?: string;
  transfer_type?: string;
  transaction_from_address?: string;
  transaction_to_address?: string;
  transaction_hash?: string;
  log_index?: string;
  block_timestamp?: string;
}

