const UserTransaction = {
  name: "UserTransaction",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string@",
    safleId: "string@",
    transactionHash: "string@",
  },
};

const Registration = {
  name: "Registration",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string@",
    safleId: "string@",
    factory: "string@",
  },
};

const userStats = {
  name: "userStats",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string@",
    safleId: "string@",
    transactionsCount: "number@",
  },
};

const Factory = {
  name: "Factory",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    childs: ["string"],
    factory: "string@",
    childCount: "number@",
  },
};

const Transaction = {
  name: "Transaction",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    transaction_hash: "string@",
    transaction_nonce: "string?",
    transaction_index: "string?",
    transaction_from_address: "string?",
    transaction_to_address: "string?",
    transaction_value: "string?",
    transaction_gas: "string?",
    transaction_gas_price: "string?",
    transaction_input: "string?",
    transaction_receipt_cumulative_gas_used: "string?",
    transaction_receipt_gas_used: "string?",
    transaction_receipt_status: "string?",
    receipt_effective_gas_price: "string?",
  },
};

module.exports = {
  UserTransaction,
  userStats,
  Transaction,
  Factory,
  Registration,
};
