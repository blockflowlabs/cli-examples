// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import { Document } from "@blockflow-labs/utils";

export class Staker {
  static entity = "Staker";
  static schema = {
    id: { type: "String", index: true },
    address: "string",
    operator: { type: "string", index: true },
    shares: [{ strategy: "string", shares: "string" }],
    createdAt: "Number",
    updatedAt: "Number",
    createdAtBlock: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Operator {
  static entity = "Operator";
  static schema = {
    id: { type: "String", index: true },
    address: "string",
    metadataURI: "string",
    metadataName: "string",
    metadataDescription: "string",
    metadataDiscord: "string",
    metadataLogo: "string",
    metadataTelegram: "string",
    metadataWebsite: "string",
    metadataX: "string",
    isMetadataSynced: "Boolean",
    avsRegistrations: [{ address: "string", isActive: "Boolean" }],
    shares: [{ strategy: "string", shares: "string" }],
    totalStakers: "Number",
    createdAt: "Number",
    updatedAt: "Number",
    createdAtBlock: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class AVS {
  static entity = "AVS";
  static schema = {
    id: { type: "String", index: true },
    address: "string",
    metadataURI: "string",
    metadataName: "string",
    metadataDescription: "string",
    metadataDiscord: "string",
    metadataLogo: "string",
    metadataTelegram: "string",
    metadataWebsite: "string",
    metadataX: "string",
    isMetadataSynced: "Boolean",
    activeOperators: ["string"],
    inactiveOperators: ["string"],
    totalOperators: "Number",
    createdAt: "Number",
    updatedAt: "Number",
    createdAtBlock: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class AvsOperator {
  static entity = "AvsOperator";
  static schema = {
    id: { type: "String", index: true },
    avsAddress: { type: "string", index: true },
    operatorAddress: "string",
    isActive: "Boolean",
    createdAt: "Number",
    createdAtBlock: "Number",
    updatedAt: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Withdrawal {
  static entity = "Withdrawal";
  static schema = {
    id: { type: "String", index: true },
    withdrawalRoot: "string",
    nonce: "Number",
    stakerAddress: "string",
    delegatedTo: "string",
    withdrawerAddress: "string",
    strategyShares: [{ strategy: "string", shares: "string" }],
    isCompleted: "Boolean",
    createdAt: "Number",
    createdAtBlock: "Number",
    updatedAt: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Deposit {
  static entity = "Deposit";
  static schema = {
    id: { type: "String", index: true },
    transactionHash: "string",
    stakerAddress: "string",
    tokenAddress: "string",
    strategyAddress: "string",
    shares: "string",
    amount: "string",
    createdAt: "Number",
    createdAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class EigenPod {
  static entity = "EigenPod";
  static schema = {
    id: { type: "String", index: true },
    address: "string",
    owner: "string",
    createdAt: "Number",
    createdAtBlock: "Number",
    updatedAt: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class PodTransactions {
  static entity = "PodTransactions";
  static schema = {
    id: { type: "String", index: true },
    podAddress: "string",
    podOwner: "string",
    transactionHash: "string",
    sharesDelta: "string",
    transactionIndex: "Number",
    createdAt: "Number",
    createdAtBlock: "Number",
    updatedAt: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Strategy {
  static entity = "Strategy";
  static schema = {
    id: { type: "String", index: true },
    address: "string",
    symbol: "string",
    underlyingToken: {
      address: "string",
      name: "string",
      symbol: "string",
      decimals: "Number",
    },
    isDepositWhitelist: "Boolean",
    sharesToUnderlying: "string",
    totalShares: "string",
    totalAmount: "string",
    createdAt: "Number",
    createdAtBlock: "Number",
    updatedAt: "Number",
    updatedAtBlock: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Stats {
  static entity = "Stats";
  static schema = {
    id: { type: "String", index: true },
    totalRegisteredAvs: "Number",
    totalActiveAvs: "Number",
    totalRegisteredOperators: "Number",
    totalActiveOperators: "Number",
    totalRegisteredStakers: "Number",
    totalActiveStakers: "Number",
    totalDepositWhitelistStrategies: "Number",
    totalCompletedWithdrawals: "Number",
    totalQueuedWithdrawals: "Number",
    totalDeposits: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export type StrategyShares = {
  strategy: string;
  shares: string;
};

export type AVSRegistrations = {
  address: string;
  isActive: Boolean;
};

type stringIndex = { type: string; index: true };

export interface IStaker extends Document {
  id: string;
  address: string;
  operator: stringIndex;
  shares: [StrategyShares];
  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IOperator extends Document {
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

  avsRegistrations: [AVSRegistrations];
  shares: [StrategyShares];

  totalStakers: Number;

  createdAt: Number;
  updatedAt: Number;
  createdAtBlock: Number;
  updatedAtBlock: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IAVS extends Document {
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
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IAvsOperator extends Document {
  id: string;
  avsAddress: stringIndex;
  operatorAddress: string;
  isActive: Boolean;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IWithdrawal extends Document {
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
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IDeposit extends Document {
  id: string;
  transactionHash: string;
  stakerAddress: string;
  tokenAddress: string;
  strategyAddress: string;
  shares: string;
  amount: string;
  createdAt: Number;
  createdAtBlock: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IEigenPod extends Document {
  id: string;
  address: string;
  owner: string;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IPodTransactions extends Document {
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
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export type StrategyToken = {
  address: string;
  name: string;
  symbol: string;
  decimals: Number;
};

export interface IStrategy extends Document {
  id: string;
  address: string;
  symbol: string;
  underlyingToken: StrategyToken;
  isDepositWhitelist: Boolean;

  sharesToUnderlying: string;
  totalShares: string;
  totalAmount: string;

  createdAt: Number;
  createdAtBlock: Number;
  updatedAt: Number;
  updatedAtBlock: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IStats extends Document {
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
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}
