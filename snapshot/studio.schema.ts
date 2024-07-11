import { String, Array } from "@blockflow-labs/utils";

export interface Delegation {
  id: String;
  delegator: string;
  space: string;
  delegate: string;
  timestamp: string;
}

export interface Block {
  id: String;
  number: Number;
  timestamp: string;
}

export interface Sig {
  id: String;
  account: string;
  messageHash: string;
  timestamp: string;
}
