import { IEventContext } from "@blockflow-labs/utils";

import { VersionChangeHelper } from "./helper";
import { VersionChanged, Resolver, Domain } from "../../../types/schema";

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
  const { event, transaction } = context;
  let { node, newVersion } = event;

  node = node.toString();
  newVersion = Number(newVersion.toString());

  const helper = new VersionChangeHelper(
    bind(Domain),
    bind(Resolver),
    bind(VersionChanged),
  );

  let resolverEvent = await helper.createVersionChanged(
    helper.createEventID(context),
  );
  resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address,
  );
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.version = newVersion;
  await helper.saveVersionChanged(resolverEvent);

  let domain = await helper.loadDomain(node);
  if (domain && domain.resolver === resolverEvent.resolver) {
    domain.resolvedAddress = null;
    await helper.saveDomain(domain);
  }

  let resolver = await helper.getOrCreateResolver(
    node,
    transaction.transaction_to_address,
  );
  resolver.addr = null;
  resolver.contentHash = null;
  resolver.texts = null;
  resolver.coinTypes = null;
  await helper.saveResolver(resolver);
};
