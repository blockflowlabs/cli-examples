import { String, Array } from "@blockflow-labs/utils";

export interface burnTransactionsTable {
  id: String;
  amount: number;
  timeStamp: number;
  isCompleted: Boolean;
  sourceDomain: string;
  mintRecipient: string;
  messageSender: string;
  transactionHash: string;
  destinationDomain: string;

  burnToken: string;
  destinationCaller: string;
  destinationTokenMessenger: string;
}

export interface mintTransactionsTable {
  id: String;
  amount: number;
  timeStamp: number;
  sourceDomain: string;
  mintRecipient: string;
  messageSender: string;
  transactionHash: string;
  destinationDomain: string;

  caller: string;
  sender: string;
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
