import { String, Array } from "@blockflow-labs/utils";

export interface avoData {
  id: String;
  transactionHash: string;
  broadcaster: string;
  status: string;
  time: string;
  network: string;
  transactionActionAmount: string;
  transactionActionTo: string;
  user: string;
  avocadoWallet: string;
}
