import { String } from "@blockflow-labs/utils";

export interface User {
  id: String;
  balance: string;
  txnCount: string;
  largestTxn: string;
  smallestTxn: string;
  lastTxnOn: string;
}
