import { IEventContext } from "@blockflow-labs/utils";

import { Domain, Resolver } from "../../../types/schema";
/**
 * @dev Event::NewResolver(bytes32 node, address resolver)
 * @param context trigger object with contains {event: {node ,resolver }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewResolverHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NewResolver here

  const { event, transaction, block, log } = context;
  const { node, resolver } = event;

  const id = resolver.toString()+"-"+node.toLowerCase();
  
  let domainDB = await bind(Domain).findOne({ id: node.toLowerCase() });
  domainDB.resolver = id;

  let resolverDB = await bind(Resolver).findOne({ id: id });
  if (!resolverDB) {
    await bind(Resolver).create({
      id: id,
      address: resolver.toString(),
      domain: node.toLowerCase(),
      events:[resolver, transaction.transaction_hash]
    });
    domainDB.resolvedAddress = "";
    domainDB.events = [node, transaction.transaction_hash, block.block_number];
  }
  else{
    domainDB.resolvedAddress = resolverDB.addr;
  }
  await domainDB.save();
};
