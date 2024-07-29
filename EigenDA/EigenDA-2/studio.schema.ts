import { String } from "@blockflow-labs/utils";

export interface Batch {
  id: String;
  batchId: string;
  batchHeaderHash: string;
  gasFees: string;
  blockNumber: string;
  blockTimestamp: string;
  transactionHash: string;
  batchHeader: BatchHeader;
}
//issue in operator ID, how do ifetch it and nonsigners data too 
//is it the same from operatorregistry 
export interface GasFees{
  id: String;
  gasUsed: string;
  gasPrice: string;
  transactionFee: string;
}

export type BatchHeader = {
  id: String;
  blobHeadersRoot: string;
  quorumNumbers: number[];
  signedStakeForQuorums: number[];
  referenceBlockNumber: number;
}

export interface NewPubKeyRegistration{
  id: String;
  operator: string;
  pubkeyG1_X: number;
  pubkeyG1_Y: number;
  pubkeyG2_X: number;
  pubkeyG2_Y: number;
  blockNumber: number;
  blockTimestamp: string;
  transactionHash: string;
}

export interface OperatorAddedToQuorum{
  id: String;
  operator: string;
  quorumNumbers: string;
  blockNumber: number;
  blockTimestamp: string;
  transactionHash: string;
}

export interface OperatorRemovedFromQuorum{
  id: String;
  operator: string;
  quorumNumbers: string;
  blockNumber: number;
  blockTimestamp: string;
  transactionHash: string;
}