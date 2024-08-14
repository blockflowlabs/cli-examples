import { String, Array } from "@blockflow-labs/utils";

export interface ERC20Table {
  id: String;
  address: string;
  counterPartyAddress: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  rawAmount: number;
  rawAmountString: string;
  amount: string;
  amountString: string;
  usdValue: number;
  usdExchangeRate: number;
  transactionHash: string;
  logIndex: number;
  blockTimestamp: string;
  blockNumber: number;
  blockHash: string;
}
