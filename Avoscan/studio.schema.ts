import { String, Array } from "@blockflow-labs/utils";

type Action = {
  value: string;
  to: string;
  from: string;
  address: string;
};

export interface avoData {
  id: String;
  transactionHash: string;
  broadcaster: string;
  status: string;
  time: string;
  network: string;
  actions: [Action];
  user: string;
  avocadoWallet: string;
}
