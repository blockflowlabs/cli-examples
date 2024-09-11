export type StrategyShares = {
  strategy: string;
  shares: string;
};

export type AVSRegistrations = {
  address: string;
  isActive: Boolean;
};

export interface Staker {
  id: string;
  address: string;
  operator: string;
  shares: [StrategyShares];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface Operator {
  id: string;
  address: string;
  avsRegistrations: [AVSRegistrations];
  metadataURI: string;
  shares: [StrategyShares];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface AVS {
  id: string;
  address: string;
  metadataURI: string;
  operators: [string];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface Withdrawal {
  id: string;
  withdrawalRoot: string;
  nonce: Number;
  stakerAddress: string;
  delegatedTo: string;
  withdrawerAddress: string;
  strategyShares: [StrategyShares];
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
  createdAt: Number;
  createdAtBlock: Number;
}
