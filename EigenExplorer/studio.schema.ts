import { String } from "@blockflow-labs/utils";

export interface Staker {
  id: String;
  address: String;
  operator: String;
  strategies: [String];
  shares: [String];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface Operator {
  id: String;
  address: String;
  avsAddresses: [String];
  isAvsActive: [Boolean];
  metadataURI: String;
  strategies: [String];
  shares: [String];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface AVS {
  id: String;
  address: String;
  metadataURI: String;
  operators: [String];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
}

export interface Withdrawal {
  id: String;
  withdrawalRoot: String;
  nonce: Number;
  stakerAddress: String;
  delegatedTo: String;
  withdrawerAddress: String;
  strategies: [String];
  shares: [String];
  isCompleted: Boolean;
  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
}

export interface Deposit {
  id: String;
  transactionHash: String;
  stakerAddress: String;
  tokenAddress: String;
  strategyAddress: String;
  shares: String;
  createdAt: Number;
  createdAtBlock: Number;
}
