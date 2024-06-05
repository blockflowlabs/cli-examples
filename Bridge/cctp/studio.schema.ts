import { String, Array } from "@blockflow-labs/utils";

export interface burnTransactionsTable {
  id: String;
  transactionHash: string;
  sourceDomain: string;
  destinationDomain: string;
  amount: number;
  mintRecipient: string;
  messageSender: string;
  timeStamp: string;
}

export interface mintTransactionsTable {
  id: String;
  transactionHash: string;
  sourceDomain: string;
  destinationDomain: string;
  amount: number;
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
  chainId: string;
  tokenAddress: string;
  permessageburnlimit: number;
}

export interface FeeInfo {
  id: String;
  feeInUSDC: number;
}

export interface cctpDayDataDB {
  id: String; 
  date: string;
  txCount: string;
  dailyVolume: string; 
  deposited: string; 
  withdrawal: string; 
  totalFee: string;
}

export interface cctpWeekDataDB {
  id: String; 
  week: string;
  txCount: string;
  weeklyVolume: string;
  deposited: string;
  withdrawal: string;
  totalFee: string;
}

export interface cctpMonthDataDB {
  id: String;
  month: string;
  txCount: string;
  monthlyVolume: string;
  deposited: string;
  withdrawal: string;
  totalFee: string;
}

export interface cctpYearDataDB {
  id: String;
  year: string;
  txCount: string;
  yearlyVolume: string;
  deposited: string;
  withdrawal: string;
  totalFee: string;
}

export interface cctpAllTimeDB {
  id: String;
  txCount: string;
  allTimeVolume: string;
  deposited: string;
  withdrawal: string;
  totalFee: string;
}

