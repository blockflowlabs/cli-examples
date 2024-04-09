import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  Account,
  Resolver,
  Domain,
  AddrChanged,
  IDomain,
} from "../../../types/schema";
import { createResolverID, createEventID } from "../../../utils/helper";

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
  const { event, transaction, log } = context;
  let { node, a } = event;

  a = a.toString();
  node = node.toString();

  {
    const accountDB: Instance = bind(Account);
    await accountDB.create({ id: a.toLowerCase() });
  }

  {
    const resolverDB: Instance = bind(Resolver);
    await resolverDB.create({
      id: createResolverID(node, log.log_address).toLowerCase(),
      domain: node,
      address: log.log_address,
      addr: a,
    });
  }

  {
    const domainDB: Instance = bind(Domain);
    let domain: IDomain = await domainDB.findOne({ id: node.toLowerCase() });
    // prettier-ignore
    if(domain && domain.resolver.toString().toLowerCase() === createResolverID(node, log.log_address).toLowerCase()) {
      domain.resolvedAddress = a;
      await domainDB.save(domain);
    }
  }

  const resolverEventDB: Instance = bind(AddrChanged);
  await resolverEventDB.create({
    id: createEventID(context),
    resolver: createResolverID(node, log.log_address).toLowerCase(),
    addr: a,
    transactionID: transaction.transaction_hash,
  });
};
