export const Staker = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-Staker",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "operator": "string?",
    "shares": "any?",
    "totalWithdrawals": "number?",
    "totalDeposits": "number?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IStaker {
  address: string;
  operator: string;
  shares: any;
  totalWithdrawals: number;
  totalDeposits: number;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const Operator = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-Operator",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "details": "any?",
    "metadataURI": "string?",
    "metadataName": "string?",
    "metadataDescription": "string?",
    "metadataDiscord": "string?",
    "metadataLogo": "string?",
    "metadataTelegram": "string?",
    "metadataWebsite": "string?",
    "metadataX": "string?",
    "isMetadataSynced": "boolean?",
    "avsRegistrations": "any?",
    "shares": "any?",
    "totalStakers": "number?",
    "totalAvs": "number?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IOperator {
  address: string;
  details: any;
  metadataURI: string;
  metadataName: string;
  metadataDescription: string;
  metadataDiscord: string;
  metadataLogo: string;
  metadataTelegram: string;
  metadataWebsite: string;
  metadataX: string;
  isMetadataSynced: boolean;
  avsRegistrations: any;
  shares: any;
  totalStakers: number;
  totalAvs: number;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const AVS = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-AVS",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "metadataURI": "string?",
    "metadataName": "string?",
    "metadataDescription": "string?",
    "metadataDiscord": "string?",
    "metadataLogo": "string?",
    "metadataTelegram": "string?",
    "metadataWebsite": "string?",
    "metadataX": "string?",
    "isMetadataSynced": "boolean?",
    "activeOperators": "any?",
    "inactiveOperators": "any?",
    "totalOperators": "number?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IAVS {
  address: string;
  metadataURI: string;
  metadataName: string;
  metadataDescription: string;
  metadataDiscord: string;
  metadataLogo: string;
  metadataTelegram: string;
  metadataWebsite: string;
  metadataX: string;
  isMetadataSynced: boolean;
  activeOperators: any;
  inactiveOperators: any;
  totalOperators: number;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const AvsOperator = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-AvsOperator",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "avsAddress": "string?",
    "operatorAddress": "string?",
    "isActive": "boolean?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IAvsOperator {
  rowId: string;
  avsAddress: string;
  operatorAddress: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const Withdrawal = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-Withdrawal",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "withdrawalRoot": "string?",
    "nonce": "number?",
    "stakerAddress": "string?",
    "delegatedTo": "string?",
    "withdrawerAddress": "string?",
    "strategyShares": "any?",
    "isCompleted": "boolean?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IWithdrawal {
  rowId: string;
  withdrawalRoot: string;
  nonce: number;
  stakerAddress: string;
  delegatedTo: string;
  withdrawerAddress: string;
  strategyShares: any;
  isCompleted: boolean;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const Deposit = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-Deposit",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "transactionHash": "string?",
    "stakerAddress": "string?",
    "tokenAddress": "string?",
    "strategyAddress": "string?",
    "shares": "string?",
    "amount": "number?",
    "createdAt": "number?",
    "createdAtBlock": "number?"
  },
  "reorg": true
};

export interface IDeposit {
  rowId: string;
  transactionHash: string;
  stakerAddress: string;
  tokenAddress: string;
  strategyAddress: string;
  shares: string;
  amount: number;
  createdAt: number;
  createdAtBlock: number;
}

export const EigenPod = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-EigenPod",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "owner": "string?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IEigenPod {
  address: string;
  owner: string;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const PodTransactions = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-PodTransactions",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "podAddress": "string?",
    "podOwner": "string?",
    "transactionHash": "string?",
    "sharesDelta": "string?",
    "transactionIndex": "number?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IPodTransactions {
  rowId: string;
  podAddress: string;
  podOwner: string;
  transactionHash: string;
  sharesDelta: string;
  transactionIndex: number;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const Stats = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-Stats",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "statId": "string?",
    "totalRegisteredAvs": "number?",
    "totalActiveAvs": "number?",
    "totalRegisteredOperators": "number?",
    "totalActiveOperators": "number?",
    "totalRegisteredStakers": "number?",
    "totalActiveStakers": "number?",
    "totalDepositWhitelistStrategies": "number?",
    "totalCompletedWithdrawals": "number?",
    "totalWithdrawals": "number?",
    "totalDeposits": "number?",
    "minWithdrawalDelayBlocks": "number?"
  },
  "reorg": true
};

export interface IStats {
  statId: string;
  totalRegisteredAvs: number;
  totalActiveAvs: number;
  totalRegisteredOperators: number;
  totalActiveOperators: number;
  totalRegisteredStakers: number;
  totalActiveStakers: number;
  totalDepositWhitelistStrategies: number;
  totalCompletedWithdrawals: number;
  totalWithdrawals: number;
  totalDeposits: number;
  minWithdrawalDelayBlocks: number;
}

export const Strategy = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-Strategy",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "symbol": "string?",
    "underlyingToken": "any?",
    "isDepositWhitelist": "boolean?",
    "sharesToUnderlying": "string?",
    "totalShares": "string?",
    "totalAmount": "string?",
    "totalDeposits": "number?",
    "totalWithdrawals": "number?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IStrategy {
  address: string;
  symbol: string;
  underlyingToken: any;
  isDepositWhitelist: boolean;
  sharesToUnderlying: string;
  totalShares: string;
  totalAmount: string;
  totalDeposits: number;
  totalWithdrawals: number;
  createdAt: number;
  updatedAt: number;
  createdAtBlock: number;
  updatedAtBlock: number;
}

export const OperatorHistory = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-OperatorHistory",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "operatorAddress": "string?",
    "avsAddress": "string?",
    "event": "string?",
    "transactionHash": "string?",
    "createdAt": "number?",
    "createdAtBlock": "number?"
  },
  "reorg": true
};

export interface IOperatorHistory {
  rowId: string;
  operatorAddress: string;
  avsAddress: string;
  event: string;
  transactionHash: string;
  createdAt: number;
  createdAtBlock: number;
}

export const OperatorRestakeHistory = {
  "name": "c62edbfe-e98b-43a6-b826-97936508c7ce-OperatorRestakeHistory",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "operatorAddress": "string?",
    "stakerAddress": "string?",
    "action": "string?",
    "transactionHash": "string?",
    "shares": "any?",
    "createdAt": "number?",
    "createdAtBlock": "number?",
    "updatedAt": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IOperatorRestakeHistory {
  rowId: string;
  operatorAddress: string;
  stakerAddress: string;
  action: string;
  transactionHash: string;
  shares: any;
  createdAt: number;
  createdAtBlock: number;
  updatedAt: number;
  updatedAtBlock: number;
}

