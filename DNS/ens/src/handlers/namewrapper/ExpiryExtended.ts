import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { WrappedDomain, Domain, Expiryextendedevent} from "../../types/schema";
import { createorloaddomain, checkPccBurned, PARENT_CANNOT_CONTROL } from "../../utils/helper";
/**
 * @dev Event::ExpiryExtended(bytes32 node, uint64 expiry)
 * @param context trigger object with contains {event: {node ,expiry }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ExpiryExtendedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ExpiryExtended here

  const { event, transaction, block, log } = context;
  const { node, expiry } = event;

  let domainDB : Instance = bind(Domain);

  let wrappeddoamin = await bind(WrappedDomain).findOne({ id: node });
  wrappeddoamin.expiryDate = expiry;
  wrappeddoamin.events = [
    node,
    block.block_number,
    transaction.transaction_hash,
  ];
  await wrappeddoamin.save();
if(checkPccBurned(wrappeddoamin.fuses)){
  let domain = await createorloaddomain(domainDB,node,block.block_timestamp,bind);
  if(!domain.expiryDate || expiry> domain.expiryDate){
    domain.expiryDate = expiry;
    domain.save();
  }
}
let expiryExtendedEvent: Instance = bind(Expiryextendedevent);
let expiryevent = await bind(Expiryextendedevent).create({
  id: node,
  expiry: expiry,
  blockNumber: block.block_number,
  transactionID: transaction.transaction_hash,
});
};
