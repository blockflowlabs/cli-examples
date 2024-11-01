export const Staker = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-Staker",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "operator": "string?",
    "shares": [
      {
        "strategy": "string?",
        "shares": "string?"
      }
    ],
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
  address?: string;
  operator?: string;
  shares: { strategy: string; shares: string }[];
  totalWithdrawals?: number;
  totalDeposits?: number;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const Operator = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-Operator",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "details": [
      {
        "earningsReceiver": "string?",
        "delegationApprover": "string?",
        "stakerOptOutWindowBlocks": "number?"
      }
    ],
    "metadataURI": "string?",
    "metadataName": "string?",
    "metadataDescription": "string?",
    "metadataDiscord": "string?",
    "metadataLogo": "string?",
    "metadataTelegram": "string?",
    "metadataWebsite": "string?",
    "metadataX": "string?",
    "isMetadataSynced": "boolean?",
    "avsRegistrations": [
      {
        "address": "string?",
        "isActive": "boolean?"
      }
    ],
    "shares": [
      {
        "strategy": "string?",
        "shares": "string?"
      }
    ],
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
  address?: string;
  details: { earningsReceiver: string; delegationApprover: string; stakerOptOutWindowBlocks: number }[];
  metadataURI?: string;
  metadataName?: string;
  metadataDescription?: string;
  metadataDiscord?: string;
  metadataLogo?: string;
  metadataTelegram?: string;
  metadataWebsite?: string;
  metadataX?: string;
  isMetadataSynced?: boolean;
  avsRegistrations: { address: string; isActive: boolean }[];
  shares: { strategy: string; shares: string }[];
  totalStakers?: number;
  totalAvs?: number;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const AVS = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-AVS",
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
    "activeOperators": [
      "string?"
    ],
    "inactiveOperators": [
      "string?"
    ],
    "totalOperators": "number?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IAVS {
  address?: string;
  metadataURI?: string;
  metadataName?: string;
  metadataDescription?: string;
  metadataDiscord?: string;
  metadataLogo?: string;
  metadataTelegram?: string;
  metadataWebsite?: string;
  metadataX?: string;
  isMetadataSynced?: boolean;
  activeOperators: string[];
  inactiveOperators: string[];
  totalOperators?: number;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const AvsOperator = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-AvsOperator",
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
  rowId?: string;
  avsAddress?: string;
  operatorAddress?: string;
  isActive?: boolean;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const Withdrawal = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-Withdrawal",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "withdrawalRoot": "string?",
    "nonce": "number?",
    "stakerAddress": "string?",
    "delegatedTo": "string?",
    "withdrawerAddress": "string?",
    "strategyShares": [
      {
        "strategy": "string?",
        "shares": "string?"
      }
    ],
    "isCompleted": "boolean?",
    "createdAt": "number?",
    "updatedAt": "number?",
    "createdAtBlock": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IWithdrawal {
  rowId?: string;
  withdrawalRoot?: string;
  nonce?: number;
  stakerAddress?: string;
  delegatedTo?: string;
  withdrawerAddress?: string;
  strategyShares: { strategy: string; shares: string }[];
  isCompleted?: boolean;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const Deposit = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-Deposit",
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
  rowId?: string;
  transactionHash?: string;
  stakerAddress?: string;
  tokenAddress?: string;
  strategyAddress?: string;
  shares?: string;
  amount?: number;
  createdAt?: number;
  createdAtBlock?: number;
}

export const EigenPod = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-EigenPod",
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
  address?: string;
  owner?: string;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const PodTransactions = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-PodTransactions",
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
  rowId?: string;
  podAddress?: string;
  podOwner?: string;
  transactionHash?: string;
  sharesDelta?: string;
  transactionIndex?: number;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const Stats = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-Stats",
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
  statId?: string;
  totalRegisteredAvs?: number;
  totalActiveAvs?: number;
  totalRegisteredOperators?: number;
  totalActiveOperators?: number;
  totalRegisteredStakers?: number;
  totalActiveStakers?: number;
  totalDepositWhitelistStrategies?: number;
  totalCompletedWithdrawals?: number;
  totalWithdrawals?: number;
  totalDeposits?: number;
  minWithdrawalDelayBlocks?: number;
}

export const Strategy = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-Strategy",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "address": "string?",
    "symbol": "string?",
    "underlyingToken": [
      {
        "address": "string?",
        "symbol": "string?",
        "name": "string?",
        "decimals": "number?"
      }
    ],
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
  address?: string;
  symbol?: string;
  underlyingToken: { address: string; symbol: string; name: string; decimals: number }[];
  isDepositWhitelist?: boolean;
  sharesToUnderlying?: string;
  totalShares?: string;
  totalAmount?: string;
  totalDeposits?: number;
  totalWithdrawals?: number;
  createdAt?: number;
  updatedAt?: number;
  createdAtBlock?: number;
  updatedAtBlock?: number;
}

export const OperatorHistory = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-OperatorHistory",
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
  rowId?: string;
  operatorAddress?: string;
  avsAddress?: string;
  event?: string;
  transactionHash?: string;
  createdAt?: number;
  createdAtBlock?: number;
}

export const OperatorRestakeHistory = {
  "name": "63b0c62f-a9d2-44cb-be49-ea4f0156db25-OperatorRestakeHistory",
  "db": "postgres",
  "type": "managed",
  "properties": {
    "rowId": "string?",
    "operatorAddress": "string?",
    "stakerAddress": "string?",
    "action": "string?",
    "transactionHash": "string?",
    "shares": [
      {
        "strategy": "string?",
        "shares": "string?"
      }
    ],
    "createdAt": "number?",
    "createdAtBlock": "number?",
    "updatedAt": "number?",
    "updatedAtBlock": "number?"
  },
  "reorg": true
};

export interface IOperatorRestakeHistory {
  rowId?: string;
  operatorAddress?: string;
  stakerAddress?: string;
  action?: string;
  transactionHash?: string;
  shares: { strategy: string; shares: string }[];
  createdAt?: number;
  createdAtBlock?: number;
  updatedAt?: number;
  updatedAtBlock?: number;
}

