import { IEventContext } from "@blockflow-labs/utils";

import { AddrChangeHelper } from "./helper";
import { Account, Resolver, Domain, AddrChanged } from "../../../types/schema";

/**
 * @dev Event::AddrChanged(bytes32 node, address a)
 * @param context trigger object with contains {event: {node ,a }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddrChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for AddrChanged here
  const { event, transaction } = context;
  let { node, a } = event;

  a = a.toString();
  node = node.toString();

  const helper = new AddrChangeHelper(
    bind(Account),
    bind(Domain),
    bind(Resolver),
    bind(AddrChanged)
  );

  const account = await helper.createAccountChanged(a);
  await helper.saveAccountChanged(account);

  let resolver = await helper.createResolver(node, a);
  resolver.domain = node;
  resolver.address = transaction.transaction_to_address;
  resolver.addr = a;
  await helper.saveResolver(resolver);

  let domain = await helper.loadDomain(node);
  if (domain && domain.resolver == resolver.id) {
    domain.resolvedAddress = a;
    await helper.saveDomain(domain);
  }

  let resolverEvent = await helper.createAddrChanged(
    helper.createEventID(context)
  );
  resolverEvent.resolver = resolver.id;
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.addr = a;
  await helper.saveAddrChanged(resolverEvent);
};
