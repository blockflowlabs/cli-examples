import { String, Array } from "@blockflow-labs/utils";

export interface User {
  id: String;
  tokenBalance: number;
  vaultBalance: number;
  entryValue: number;
  realizedEarnings: number;
}

export interface Token {
  id: String;
  name: string;
  totalSupply: number;
}

export interface Vault {
  id: String;
  name: string;
  vaultAddress: string;
  totalSupply: number;
  totalHolding: number;
  pricePerShare: number;
  totalTokenEarnings: number;
  minimumLock: number;
  peripheryAddress: string;
}

export interface dailyUserTrack{
  id: String;
  userId: String;
  dailyVaultBalance: number;
  dailyEntryValue: number;
}

export interface monthlyUserTrack{
  id: String;
  userId: String;
  monthlyVaultBalance: number;
  monthlyEntryValue: number;
}

export interface yearlyUserTrack{
  id: String;
  userId: String;
  yearlyVaultBalance: number;
  yearlyEntryValue: number;
}

export interface dailyVolume{
  id: String;
  dailyVaultTotalSupply: number;
  dailyPricePerShare: number;
}

export interface monthlyVolume{
  id: String;
  monthlyVaultTotalSupply: number;
  monthlyPricePerShare: number;
}

export interface yearlyVolume{
  id: String;
  yearlyVaultTotalSupply: number;
  yearlyPricePerShare: number;
}

export interface dailyAPY{
  id: String;
  dailyTokenEarnings: number;
  averageTokenEarningsPerToken: number;
  dailyAPYamount: number;
}

export interface weeklyAPY{
  id: String;
  weeklyTokenEarnings: number;
  averageTokenEarningsPerToken: number;
  weeklyAPYamount: number;
}

export interface monthlyAPY{
  id: String;
  monthlyTokenEarnings: number;
  averageTokenEarningsPerToken: number;
  monthlyAPYamount: number;
}

export interface yearlyAPY{
  id: String;
  yearlyTokenEarnings: number;
  averageTokenEarningsPerToken: number;
  yearlyAPYamount: number;
}
