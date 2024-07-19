import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Batch, GasFees } from "../../types/schema";

/**
 * @dev Event::BatchConfirmed(bytes32 batchHeaderHash, uint32 batchId)
 * @param context trigger object with contains {event: {batchHeaderHash ,batchId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BatchConfirmedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BatchConfirmed here

  const { event, transaction, block, log } = context;
  const { batchHeaderHash, batchId } = event;

  const BatchDB: Instance =  bind(Batch);
  const GasFeesDB: Instance =  bind(GasFees);
  let bId = transaction.transaction_hash;
  let gasId = `${transaction.transaction_gas}-${transaction.transaction_hash}`;
  let transactionfee = (parseInt(transaction.transaction_gas)*parseInt(transaction.transaction_gas_price)).toString();

  let batch = await BatchDB.findOne({
    id: bId
  });
  if(!batch){
   batch = await BatchDB.create({
    id: bId,
    batchId : batchId,
    batchHeaderHash: batchHeaderHash,
    gasFees: transaction.transaction_gas_price,
    blockNumber: block.block_number,
    blockTimestamp: block.block_timestamp,
    transactionHash: transaction.transaction_hash
   })
  }
  else{
    batch.batchId = batchId;
    batch.batchHeaderHash = batchHeaderHash;
    batch.gasFees =  transaction.transaction_gas_price;
    batch.blockNumber = block.block_number;
    batch.blockTimestamp = block.block_timestamp;
    batch.transactionHash = transaction.transaction_hash
    await BatchDB.save(batch);
   }

  let gasfee = await GasFeesDB.findOne({
    id:gasId
  })
  if(!gasfee){
    gasfee = await GasFeesDB.create({
      id: gasId,
      gasUsed: transaction.transaction_gas,
      gasPrice: transaction.transaction_gas_price,
      transactionFee: transactionfee
    })
  }
  else{
    gasfee.gasUsed = transaction.transaction_gas;
    gasfee.gasPrice = transaction.transaction_gas_price;
    gasfee.transactionFee = transactionfee;
    await GasFeesDB.save(gasfee);
  }

};
