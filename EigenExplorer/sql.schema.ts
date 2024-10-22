const Staker = {
  name: "Staker",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string?",
    operator: "string?",
    shares: "any?",
    totalWithdrawals: "number?",
    totalDeposits: "number?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const Operator = {
  name: "Operator",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string?",
    details: "any?",
    metadataURI: "string?",
    metadataName: "string?",
    metadataDescription: "string?",
    metadataDiscord: "string?",
    metadataLogo: "string?",
    metadataTelegram: "string?",
    metadataWebsite: "string?",
    metadataX: "string?",
    isMetadataSynced: "boolean?",
    avsRegistrations: "any?",
    shares: "any?",
    totalStakers: "number?",
    totalAvs: "number?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const AVS = {
  name: "AVS",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string?",
    metadataURI: "string?",
    metadataName: "string?",
    metadataDescription: "string?",
    metadataDiscord: "string?",
    metadataLogo: "string?",
    metadataTelegram: "string?",
    metadataWebsite: "string?",
    metadataX: "string?",
    isMetadataSynced: "boolean?",
    activeOperators: "any?",
    inactiveOperators: "any?",
    totalOperators: "number?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const AvsOperator = {
  name: "AvsOperator",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    rowId: "string?",
    avsAddress: "string?",
    operatorAddress: "string?",
    isActive: "boolean?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const Withdrawal = {
  name: "Withdrawal",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    rowId: "string?",
    withdrawalRoot: "string?",
    nonce: "number?",
    stakerAddress: "string?",
    delegatedTo: "string?",
    withdrawerAddress: "string?",
    strategyShares: "any?",
    isCompleted: "boolean?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const Deposit = {
  name: "Deposit",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    rowId: "string?",
    transactionHash: "string?",
    stakerAddress: "string?",
    tokenAddress: "string?",
    strategyAddress: "string?",
    shares: "string?",
    amount: "number?",
    createdAt: "number?",
    createdAtBlock: "number?",
  },
};

const EigenPod = {
  name: "EigenPod",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string?",
    owner: "string?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const PodTransactions = {
  name: "PodTransactions",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    rowId: "string?",
    podAddress: "string?",
    podOwner: "string?",
    transactionHash: "string?",
    sharesDelta: "string?",
    transactionIndex: "number?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const Strategy = {
  name: "Strategy",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    address: "string?",
    symbol: "string?",
    underlyingToken: "any?",
    isDepositWhitelist: "boolean?",
    sharesToUnderlying: "string?",
    totalShares: "string?",
    totalAmount: "string?",
    totalDeposits: "number?",
    totalWithdrawals: "number?",
    createdAt: "number?",
    updatedAt: "number?",
    createdAtBlock: "number?",
    updatedAtBlock: "number?",
  },
};

const OperatorHistory = {
  name: "OperatorHistory",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    rowId: "string?",
    operatorAddress: "string?",
    avsAddress: "string?",
    event: "string?",
    transactionHash: "string?",
    createdAt: "number?",
    createdAtBlock: "number?",
  },
};

const OperatorRestakeHistory = {
  name: "OperatorRestakeHistory",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    rowId: "string?",
    operatorAddress: "string?",
    stakerAddress: "string?",
    action: "string?",
    transactionHash: "string?",
    shares: "any?",
    createdAt: "number?",
    createdAtBlock: "number?",
    updatedAt: "number?",
    updatedAtBlock: "number?",
  },
};

const Stats = {
  name: "Stats",
  db: "postgres",
  type: "managed",
  reorg: true,
  properties: {
    statId: "string?",
    totalRegisteredAvs: "number?",
    totalActiveAvs: "number?",
    totalRegisteredOperators: "number?",
    totalActiveOperators: "number?",
    totalRegisteredStakers: "number?",
    totalActiveStakers: "number?",
    totalDepositWhitelistStrategies: "number?",
    totalCompletedWithdrawals: "number?",
    totalWithdrawals: "number?",
    totalDeposits: "number?",
    minWithdrawalDelayBlocks: "number?",
  },
};

module.exports = {
  Staker,
  Operator,
  AVS,
  AvsOperator,
  Withdrawal,
  Deposit,
  EigenPod,
  PodTransactions,
  Stats,
  Strategy,
  OperatorHistory,
  OperatorRestakeHistory,
};
