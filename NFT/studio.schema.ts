import { String, Array } from "@blockflow-labs/utils";

export interface Token {
  id: String;
  collectionNFT: string;
  tokenId: string;
  tokenURI: string;
  owner: string;
  mintTime: number;
}

export interface CollectionERC721{
  id: String;
  name: string;
  symbol: string;
  tokenCount: number;
  ownerCount: number;
  transferCount: number;

}

export interface CollectionDailySnapshot {
  id: String;
  tokenCount: number;
  ownerCount: number;
  dailyTransferCount: number;
  blockNumber: number;
  timestamp: string;
}

export interface Transfer {
  id: String;
  fromAddress: string;
  toAddress: string;
  tokenAddress: string;
  tokenId: string;
  transferType: string; // mint burn transfer
  transactionFromAddress: string;
  transactionToAddress: string;
  transactionHash: string;
  logIndex: string;
  blockTimestamp: string;
  blockHash: string;
}

export interface Account {
  id: String;
  tokenCount: number;
}

export interface AccountBalance {
  id: String;
  account: string;
  CollectionERC721: string;
  tokenCount: number;
  blockNumber: number;
  timestamp: string;
}

export interface AccountDailySnapshot {
  id: String;
  account: string;
  CollectionERC721: string;
  tokenCount: number;
  blockNumber: number;
  timestamp: string;
}

export interface NonERC721Collection {
  id: String;
}
