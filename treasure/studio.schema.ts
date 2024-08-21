import { String } from "@blockflow-labs/utils";

export interface Transfer {
  id: String;
  from: string;
  to: string;
  amount: string;
}
