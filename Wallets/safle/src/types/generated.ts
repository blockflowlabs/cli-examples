export const UserTransaction = {
  "name": "XXXX-XXXX-XXXX-XXXX-UserTransaction",
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
  "name": "XXXX-XXXX-XXXX-XXXX-userStats",
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
  "name": "XXXX-XXXX-XXXX-XXXX-Transaction",
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
  transaction_nonce: string;
  transaction_index: string;
  transaction_from_address: string;
  transaction_to_address: string;
  transaction_value: string;
  transaction_gas: string;
  transaction_gas_price: string;
  transaction_input: string;
  transaction_receipt_cumulative_gas_used: string;
  transaction_receipt_gas_used: string;
  transaction_receipt_status: string;
  receipt_effective_gas_price: string;
}

export const Factory = {
  "name": "XXXX-XXXX-XXXX-XXXX-Factory",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "childs": "[string]",
    "factory": "string@",
    "childCount": "number@"
  },
  "reorg": true
};

export interface IFactory {
  childs: [string];
  factory: string;
  childCount: number;
}

export const Registration = {
  "name": "XXXX-XXXX-XXXX-XXXX-Registration",
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

