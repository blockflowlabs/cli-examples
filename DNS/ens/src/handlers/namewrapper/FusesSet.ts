import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { WrappedDomain, Domain, Fusesburntevent } from "../../types/schema";
import { createorloaddomain, checkPccBurned, PARENT_CANNOT_CONTROL } from "../../utils/helper";

/**
 * @dev Event::FusesSet(bytes32 node, uint32 fuses)
 * @param context trigger object with contains {event: {node ,fuses }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FusesSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for FusesSet here

  const { event, transaction, block, log } = context;
  const { node, fuses } = event;

  const domainDB : Instance = bind(Domain);
  
  let wrappeddoamin = await bind(WrappedDomain).findOne({ id: node });
  wrappeddoamin.fuses = fuses;
  wrappeddoamin.events = [
    node,
    block.block_number,
    transaction.transaction_hash,
  ];
  await wrappeddoamin.save();
  if(wrappeddoamin.expiryDate && checkPccBurned(wrappeddoamin.fuses)){
    let domain = await createorloaddomain(domainDB,node,block.block_timestamp,bind);
    if(!domain.expiryDate || wrappeddoamin.expiryDate > domain.expiryDate){
      domain.expiryDate = wrappeddoamin.expiryDate;
      await domain.save();
    }
  }
  let fusesburnteventDB: Instance = bind(Fusesburntevent);
  let fusesburnt = await fusesburnteventDB.create({
    id: node,
    fuses: fuses,
    blockNumber: block.block_number,
    transactionID: transaction.transaction_hash,
  });

};
