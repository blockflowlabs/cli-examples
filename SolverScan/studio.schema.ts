import { String } from "@blockflow-labs/utils";

export interface TradeData {
  id: String;
  protocolAddress: string;
  owner: string;
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  buyAmount: string;
  solver: string;
  liquiditySource: string;
  feeAmount: string;
  orderUid: string;
  timeStamp: string;
  transactionHash: string;
  gasUsed: string;
  gasCost: string;
}

export interface SolverData {
  id: String;
  solverAddress: string;
  totalTransactions: string;
  totalVolume: string;
  averageVolume: string;
  totalGasUsed: string;
}

export interface LiqudityData {
  id: String;
  target: string;
  value: string;
  selector: string;
}

export interface BridgeData {
  id: String;
  transactionHashSrc: string;
  transactionHashDest: string;
  from: string;
  fromValue: string;
  to: string;
  toValue: string;
  solver: string;
  solverGasCost: string;
  timestampSrc: string;
  timestampDest: string;
}

export interface SolverAnalysis {
  id: String;
  totalTransactions: number;
  totalVolume: string;
  averageVolume: string;
  totalGasSpent: string;
}

export interface Volumeforeachpair {
  id: String;
  frequency: number;
  volume: string;
  token1address: string;
  token2address: string;
}
