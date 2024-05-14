import { String, Array } from "@blockflow-labs/utils";

export interface PriceDB{
  id: String;
  contractAddress: String;
  name: String;
  symbol: String;
  decimals: Number;
  quote_currency: String;
  raw_price: String;
  price: String;
}

export interface chainlink_pair{
 id: String;
 update_count: Number;
 transanction_hash: String;
 last_block_number: Number;
 round_id: Number;
 impl_update: Number;
}
