import { String, Array } from "@blockflow-labs/utils";

export interface burnTransactionsTable {
  id: String;
  burnToken: string;
  transactionHash: string;
  sourceDomain: string;
  destinationDomain: string;
  amount: number;
  mintRecipient: string;
  messageSender: string;
  timeStamp: string;
  destinationTokenMessenger: string;
  destinationCaller: string;
}

export interface mintTransactionsTable {
  id: String;
  amount: number;
  transactionHash: string;
  sourceDomain: string;
  destinationDomain: string;
  mintRecipient: string;
  timeStamp: string;
}

export interface attestationTable {
  id: String;
  attestationHash: string;
  messageHash: string;
  timeStamp: string;
}

export interface DomainsTable {
  id: String;
  domainName: string;
  chainid: number;
  tokenAddress: string;
  permessageburnlimit: number;
}

export interface FeeInfo {
  id: String;
  feeInUSDC: number;
}