import { String, Array } from "@blockflow-labs/utils";

export interface PriceDB{
  id: string;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  quoteCurrency: string;
  rawPrice: string;
  price: string;
}

export interface chainlink_pair{
 id: string;
 updateCount: number;
 transanctionHash: string;
 lastBlockNumber: number;
 roundId: number;
}
