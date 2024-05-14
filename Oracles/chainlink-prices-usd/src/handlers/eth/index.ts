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
  const transanction_hash = transaction.transaction_hash.toString();
  //code for update count ad implementation update
  // const update_count +=1 
  // const impl_update = 
  //block.block_number
 
 const {current, roundId, updatedAt} = event;

 //DB bindings over here
 const priceDB: Instance = bind(PriceDB);
 const chainlink_pairDB: Instance = bind(chainlink_pair);
  
 const tokenMetadata = getTokenMetadata(contractAddress);
 //unique entry id created below
 const entryId = `${transaction.transaction_hash.toString()}-${log.log_index.toString()}`.toLowerCase();
 let amount = new BigNumber(current).dividedBy(10 ** tokenMetadata.decimals).toString();  

 //priceEntry instance created using IPriceDB interface
 let priceEntry: IPriceDB = await priceDB.findOne({
  id:entryId,
 });
 
//   id: string;
//   contractAddress: string;
//   name: string;
//   symbol: string;
//   decimals: number;
//   quoteCurrency: string;
//   rawPrice: string;
//   price: string;

 priceEntry ??= await priceDB.create({
  id: entryId,
  contractAddress,
  name: tokenMetadata.name,
  symbol: tokenMetadata.symbol,
  decimals: tokenMetadata.decimals,
  quoteCurrency: tokenMetadata.quoteCurrency,
  price: current,
  raw_price: amount,
  
 });
 await priceDB.save(priceEntry);

  const uniqueId = contractAddress;
  const transaction_hash = transaction.transaction_hash.toString();

  let pairData: Ichainlink_pair = await chainlink_pairDB.findOne({
    id:uniqueId,
  })
  //if PairData doesn't exist create a new one 
  pairData ??= await chainlink_pairDB.create({
    id: uniqueId,
    updateCount: "0",
    transanction_hash,
    lastBlockNumber: block.block_number,
    round_id: "",
 });
  await chainlink_pairDB.save(pairData);
 };





