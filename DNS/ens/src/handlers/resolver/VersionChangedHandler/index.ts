import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  createEventID,
  getResolver,
  createResolverID,
} from "../../../utils/helper";
import {
  VersionChanged,
  Resolver,
  Domain,
  IDomain,
  IResolver,
} from "../../../types/schema";

/**
 * @dev Event::VersionChanged(bytes32 node, uint64 newVersion)
 * @param context trigger object with contains {event: {node ,newVersion }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const VersionChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for VersionChanged here
  const { event, transaction, log } = context;
  let { node, newVersion } = event;

  node = node.toString();
  newVersion = Number(newVersion.toString());

  const VersionChangedDB: Instance = bind(VersionChanged);
  await VersionChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address),
    transactionID: transaction.transaction_hash,
    version: newVersion,
  });

  const domainDB: Instance = bind(Domain);
  let domain: IDomain = await domainDB.findOne({
    id: node.toLowerCase(),
  });

  // prettier-ignore
  if (domain && domain.resolver.toString().toLowerCase() === createResolverID(node, log.log_address).toLowerCase()) {
    // @ts-ignore
    domain.resolvedAddress = "";
    await domainDB.save(domain);
  }

  const resolverDB: Instance = bind(Resolver);
  const resolver: IResolver = await getResolver(
    node,
    log.log_address,
    resolverDB,
  );

  // @ts-ignore
  resolver.addr = "";
  // @ts-ignore
  resolver.contentHash = "";
  // @ts-ignore
  resolver.texts = [];
  // @ts-ignore
  resolver.coinTypes = [];

  await resolverDB.save(resolver);
};
