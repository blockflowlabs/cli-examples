import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { BigNumber } from "bignumber.js";

import { GasFees, IGasFees } from "../../types/schema";

import { Batch, IBatch } from "../../types/schema";

/**
 * @dev Event::BatchConfirmed(bytes32 batchHeaderHash, uint32 batchId)
 * @param context trigger object with contains {event: {batchHeaderHash ,batchId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BatchConfirmedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for BatchConfirmed here

  const { event, transaction, block, log } = context;
  const { batchHeaderHash, batchId } = event;

  const gasFeesDB: Instance = bind(GasFees);
  const batchDB: Instance = bind(Batch);

  let id = transaction.transaction_hash;

  let gasFeesEntity: IGasFees = await gasFeesDB.findOne({ id: id });
  let batchEntity: IBatch = await batchDB.findOne({ id: id });

  gasFeesEntity ??= await gasFeesDB.create({
    id: id,
    gas_used: transaction.transaction_receipt_gas_used.toString(),
    gas_price: transaction.transaction_gas_price.toString(),
    transaction_fee: new BigNumber(transaction.transaction_receipt_gas_used)
      .times(transaction.transaction_gas_price)
      .toString(),
  });

  batchEntity ??= await batchDB.create({
    id: id,
    batch_id: batchId.toString(),
    batch_header_hash: batchHeaderHash.toString(),
    batch_header: id,
    non_signing: id,
    gas_fees: id,
    block_timestamp: block.block_timestamp,
    transaction_hash: transaction.transaction_hash,
  });
};
