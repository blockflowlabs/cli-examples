import {
  IEventContext,
  IBind,
  IBlock,
  Instance,
  ILog,
  ISecrets,
  ITransaction,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param context trigger object with contains {event: {from ,to ,tokenId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
import { BigNumber } from "bignumber.js";
import { CollectionDailySnapshot, ICollectionDailySnapshot } from "../../types/schema";
import { Token, IToken } from "../../types/schema";
import { CollectionERC721, ICollectionERC721 } from "../../types/schema";
import { Transfer, ITransfer } from "../../types/schema";
import { Account, IAccount } from "../../types/schema";
import { AccountDailySnapshot, IAccountDailySnapshot } from "../../types/schema";
import { NonERC721Collection, INonERC721Collection } from "../../types/schema";
import { AccountBalance, IAccountBalance } from "../../types/schema";
import { getTokenMetadata } from "../../utils/tokens";
import { getAccountMetadata } from "../../utils/account";



export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;
  
  //unique id
  //let id = `${transaction.transaction_hash.toString()}-${log.log_index.toString()}`.toLowerCase();

  const tokenAddress = log.log_address.toString();
  const fromAddress = event.from.toString(); 
  const toAddress = event.to.toLowerCase();
  const GENESIS_ADDRESS = "0x0000000000000000000000000000000000000000";
  const SECONDS_PER_DAY = 60 * 60 * 24;
  const value = "1";
  const snapshotId = `${event.from.toLowerCase().toString()}-${block.block_timestamp.toString()}`.toLowerCase();
  const transactionId =`${transaction.transaction_hash.toString()}:${log.log_index.toString()}`.toLowerCase();
  const accountMetadata = getAccountMetadata(fromAddress);
  let accountAddress = accountMetadata.address;

  //declare a metdata one here
  const tokenMetadata = getTokenMetadata(tokenAddress);

  const transferType = fromAddress === GENESIS_ADDRESS ? "mint" : toAddress === GENESIS_ADDRESS ? "burn" : "transfer";
  const transferDB: Instance = bind(Transfer);
  const accountbalanceDB: Instance = bind(AccountBalance);
  const collectiondailysnapshotDB: Instance = bind(CollectionDailySnapshot);
  const tokencollectionDB: Instance = bind(CollectionERC721);

  //get or create collection
  let id = log.log_address.toString() + "-" + event.tokenId.toString();

  //const updateAccountBalance = async()
  
  let tokenCollection : ICollectionERC721 = await tokencollectionDB.findOne({id:event.address});
  //minted a new token
  if( accountAddress == GENESIS_ADDRESS ){
    tokenCollection.tokenCount+=1 ;
  }
  else{
    //transferring an existing token from non-zero address
   let balanceId = `${log.log_index.toString()}-${block.block_timestamp.toString()}`;
   let currentAccountBalance : IAccountBalance = await accountbalanceDB.findOne({id:balanceId});
   if(currentAccountBalance){
     currentAccountBalance.tokenCount-=1 ;
   
   currentAccountBalance.blockNumber = block.block_number;
   currentAccountBalance.timestamp = block.block_timestamp;
   await accountbalanceDB.save(currentAccountBalance);

   if(currentAccountBalance.tokenCount==0){
     tokenCollection.ownerCount-=1; 
   }
   //update accountbalancedailysnapshot over here 
  }
  if (accountAddress!= null){
    tokenMetadata.tokenCount -=1;
  }
  
}

  // });
  //if(fromAddress==)
  




  //getorcreatecollectionDB
  let getorcreatecollectionDB: ICollectionERC721 = await tokencollectionDB.findOne({id: event.address.toString()});

  getorcreatecollectionDB ??= await tokencollectionDB.create({
    id: event.address.toString(),
    name: tokenMetadata.name,
    symbol: tokenMetadata.tokenURI,
    tokenCount: tokenMetadata.tokenCount,
    ownerCount: tokenMetadata.ownerCount,
    transferCount: 0,
  });


  //Construct CollectiondailysnapshitDb part 
  let collectiondailysnapshot: ICollectionDailySnapshot = await collectiondailysnapshotDB.findOne({id: snapshotId});

  collectiondailysnapshot ??= await collectiondailysnapshotDB.create({
    id: snapshotId,
    tokenCount: tokenMetadata.tokenCount,
    ownerCount: tokenMetadata.ownerCount,
    dailyTransferCount: 0,  //a new one will have 0 transfers
    blockNumber: block.block_number,
    timestamp: block.block_timestamp,
  });
  await collectiondailysnapshotDB.save(collectiondailysnapshot);
  

  // Transfer part 
  let transfer: ITransfer = await transferDB.findOne({ id: transactionId });

  transfer ??= await transferDB.create({
    id: transactionId,
    fromAddress: fromAddress,
    toAddress: toAddress,
    tokenAddress: tokenAddress,
    tokenId: event.tokenId,
    transactionHash: transaction.transaction_hash.toString(),
    logIndex: log.log_index.toString(),
    blockTimestamp: block.block_timestamp.toString(),
    blockHash: block.block_hash.toString(),
  });
await transferDB.save(transfer);
};