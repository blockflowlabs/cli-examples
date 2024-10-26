export const UserTransaction = {
  "name": "fcbebeaa-33da-4d1c-aff6-b49183ed5832-UserTransaction",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string@",
    "safleId": "string@",
    "transactionHash": "string@"
  },
  "reorg": true
};

export interface IUserTransaction {
  address: string;
  safleId: string;
  transactionHash: string;
}

export const userStats = {
  "name": "fcbebeaa-33da-4d1c-aff6-b49183ed5832-userStats",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string@",
    "safleId": "string@",
    "transactionsCount": "number@"
  },
  "reorg": true
};

export interface IuserStats {
  address: string;
  safleId: string;
  transactionsCount: number;
}

export const Transaction = {
  "name": "fcbebeaa-33da-4d1c-aff6-b49183ed5832-Transaction",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "transaction_hash": "string@",
    "transaction_nonce": "string?",
    "transaction_index": "string?",
    "transaction_from_address": "string?",
    "transaction_to_address": "string?",
    "transaction_value": "string?",
    "transaction_gas": "string?",
    "transaction_gas_price": "string?",
    "transaction_input": "string?",
    "transaction_receipt_cumulative_gas_used": "string?",
    "transaction_receipt_gas_used": "string?",
    "transaction_receipt_status": "string?",
    "receipt_effective_gas_price": "string?"
  },
  "reorg": true
};

export interface ITransaction {
  transaction_hash: string;
  transaction_nonce?: string;
  transaction_index?: string;
  transaction_from_address?: string;
  transaction_to_address?: string;
  transaction_value?: string;
  transaction_gas?: string;
  transaction_gas_price?: string;
  transaction_input?: string;
  transaction_receipt_cumulative_gas_used?: string;
  transaction_receipt_gas_used?: string;
  transaction_receipt_status?: string;
  receipt_effective_gas_price?: string;
}

export const Factory = {
  "name": "fcbebeaa-33da-4d1c-aff6-b49183ed5832-Factory",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "childs": [
      "string"
    ],
    "factory": "string@",
    "childCount": "number@"
  },
  "reorg": true
};

export interface IFactory {
  childs: string[];
  factory: string;
  childCount: number;
}

export const Registration = {
  "name": "fcbebeaa-33da-4d1c-aff6-b49183ed5832-Registration",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string@",
    "safleId": "string@",
    "factory": "string@"
  },
  "reorg": true
};

export interface IRegistration {
  address: string;
  safleId: string;
  factory: string;
}

