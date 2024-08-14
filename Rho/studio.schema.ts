import { String } from "@blockflow-labs/utils";

export interface LiquidationBorrow {
  id: String;
  liquidator: string;
  borrower: string;
  repay_amount: string;
  address: string;
  seize_token: string;
  rtoken_collateral: string;
  block_timestamp: string;
  transaction_hash: string;
}

export interface Transfer {
  id: String;
  from: string;
  to: string;
  amount: string;
  block_timestamp: string;
  transaction_hash: string;
}
