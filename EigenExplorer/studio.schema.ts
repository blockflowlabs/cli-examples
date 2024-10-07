export type StrategyShares = {
  strategy: string;
  shares: string;
};

export type WithdrawStrategyShares = {
  strategy: string;
  shares: string;
  amount: string;
};

export type AVSRegistrations = {
  address: string;
  isActive: Boolean;
};

export type OperatorDetails = {
  earningsReceiver: string;
  delegationApprover: string;
  stakerOptOutWindowBlocks: Number;
};

type stringIndex = { type: string; index: true };

export interface Staker {
  id: string;
  address: string;
  operator: stringIndex;
  shares: [StrategyShares];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface Operator {
  id: string;
  address: string;

  details: OperatorDetails;

  metadataURI: string;
  metadataName: string;
  metadataDescription: string;
  metadataDiscord: string;
  metadataLogo: string;
  metadataTelegram: string;
  metadataWebsite: string;
  metadataX: string;
  isMetadataSynced: Boolean;

  avsRegistrations: [AVSRegistrations];
  shares: [StrategyShares];

  totalStakers: Number;

  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface AVS {
  id: string;
  address: string;

  metadataURI: string;
  metadataName: string;
  metadataDescription: string;
  metadataDiscord: string;
  metadataLogo: string;
  metadataTelegram: string;
  metadataWebsite: string;
  metadataX: string;
  isMetadataSynced: Boolean;

  activeOperators: [string];
  inactiveOperators: [string];
  totalOperators: Number;

  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface AvsOperator {
  id: string;
  avsAddress: stringIndex;
  operatorAddress: string;
  isActive: Boolean;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
}

export interface Withdrawal {
  id: string;
  withdrawalRoot: string;
  nonce: Number;
  stakerAddress: string;
  delegatedTo: string;
  withdrawerAddress: string;
  strategyShares: [WithdrawStrategyShares];
  isCompleted: Boolean;
  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
}

export interface Deposit {
  id: string;
  transactionHash: string;
  stakerAddress: string;
  tokenAddress: string;
  strategyAddress: string;
  shares: string;
  amount: string;
  createdAt: Number;
  createdAtBlock: Number;
}

export interface EigenPod {
  id: string;
  address: string;
  owner: string;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
}

export interface PodTransactions {
  id: string;
  podAddress: string;
  podOwner: string;
  transactionHash: string;
  sharesDelta: string;
  transactionIndex: Number;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
}

export type StrategyToken = {
  address: string;
  name: string;
  symbol: string;
  decimals: Number;
};

export interface Strategy {
  id: string;
  address: string;
  symbol: string;
  underlyingToken: StrategyToken;
  isDepositWhitelist: Boolean;

  sharesToUnderlying: string;
  totalShares: string;
  totalAmount: string;
  totalDeposits: Number;
  totalWithdrawals: Number;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
}

export interface Stats {
  id: string;
  totalRegisteredAvs: Number;
  totalActiveAvs: Number;
  totalRegisteredOperators: Number;
  totalActiveOperators: Number;
  totalRegisteredStakers: Number;
  totalActiveStakers: Number;
  totalDepositWhitelistStrategies: Number;
  totalCompletedWithdrawals: Number;
  totalQueuedWithdrawals: Number;
  totalDeposits: Number;
  minWithdrawalDelayBlocks: Number;
}

export interface OperatorHistory {
  id: string;
  operatorAddress: stringIndex;
  avsAddress: string;
  event: string;
  transactionHash: string;
  createdAt: Number;
  createdAtBlock: Number;
}
