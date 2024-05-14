import { String, Array } from "@blockflow-labs/utils";

//DB1 will include 3-4 params as discuused related to price value 
export interface PriceDB{
  id: String;
  name: String;
  symbol: String;
  decimals: Number;
  quote_currency: String;
}

//DB2 is chainlink pair and has other info
//should i store all these big numbers where big number js gonna be used as numbers or string
export interface chainlink_pair{
    id: String;
    update_count: Number;
    transanction_hash: String;
    last_block_number: Number;
    round_id: Number;
    impl_update: Number;
   }