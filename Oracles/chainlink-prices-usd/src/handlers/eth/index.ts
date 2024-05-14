import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {BigNumber} from "bignumber.js";
import { getTokenMetadata } from "../../utils/tokens";

import {PriceDB, IPriceDB} from  "../../types/schema";
import {chainlink_pair, Ichainlink_pair } from "../../types/schema";
/**
 * @dev Event::AnswerUpdated(int256 current, uint256 roundId, uint256 updatedAt)
 * @param context trigger object with contains {event: {current ,roundId ,updatedAt }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PriceHandler = async (
  { event, transaction, block, log }: IEventContext,
  bind: IBind,
  _: ISecrets,
) => {
  const contractAddress = log.log_address.toLowerCase();
  const id = `${transaction.transaction_hash} - ${log.log_index}`.toLowerCase() ;
  const transanction_hash = transaction.transaction_hash.toString();
  //code for update count ad implementation update
  // const update_count = 
  // const impl_update = 
 
 const { name, symbol, decimals, quote_currency, raw_price,price, round_id, last_block_number } = event;

 //DB bindings over here
 const priceDB: Instance = bind(PriceDB);
 const chainlink_pairDB: Instance = bind(chainlink_pair);
 
 //await updatePrice 
 let Price = await updatePrice(
  priceDB,
  id,
  contractAddress,
  name,
  symbol,
  decimals,
  quote_currency,
  raw_price,
  price,
 );
 await priceDB.save(Price);

 //await updatePairData
 let PairData = await updatePairData(
  chainlink_pairDB,
  id,
  update_count,
  transanction_hash,
  last_block_number,
  round_id,
  impl_update,
 );
 await chainlink_pairDB.save(PairData);
};

//async for updatePrice
 const updatePrice = async (
  priceDB : Instance,
  id: string,
  contractAddress: string,
  name: string,
  symbol: string,
  decimals: number,
  quote_currency: string,
  raw_price: string,
  price: string

 ): Promise<IPriceDB> => {

 const tokenMetadata = getTokenMetadata(contractAddress);
 let transactionID: PriceDB = await priceDB.findOne({id: `${transaction.transaction_hash.toString()} - ${log.log_index.toString()}`.toLowerCase()})
 const TokenDecimals = parseInt(tokenMetadata.decimals.toString());
 
 let amount = new BigNumber(raw_price).dividedBy(10**TokenDecimals);  

//if Price doesn't exist create a new one 
  Price ??= await priceDB.create({
    id: transactionID,
    contractAddress,
    name,
    symbol,
    decimals,
    quote_currency,
    raw_price,
    price,
  });
  return Price;
 };
 
 const updatePairData = async (
  chainlink_pairDB : Instance,
  id: string,
  update_count: number,
  transanction_hash: string,
  last_block_number: number,
  round_id: number,
  impl_update: number
 ): Promise<Ichainlink_pair> => {

  let transactionID: chainlink_pair = await chainlink_pairDB.findOne({id: `${transaction.transaction_hash.toString()} - ${log.log_index.toString()}`.toLowerCase()})

  
  //if PairData doesn't exist create a new one 
  PairData ??= await chainlink_pairDB.create({
    id: transactionID,
    update_count,
    transanction_hash,
    last_block_number,
    round_id,
    impl_update,
 });
  return PairData;
 };


  //DB2 
  // make another databse named chainlink- pair , it should conatin an ID eth-btc example
  //another parameter there should be update count , at every event it should be +1, store transaanction hash , last block number 
  // round ID - coz chainlink puts price in rounds to resolve conflicts 
  //transaction.transaction_hash::log.log_index.// cobvert to toString()
  //for each eth pair ho wmany times they have updated implememtation 
  //check implentation deployemnt at block number 



