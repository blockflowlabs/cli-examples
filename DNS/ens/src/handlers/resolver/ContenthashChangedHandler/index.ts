import { IEventContext, Instance, IBind } from "@blockflow-labs/utils";

import {
  createResolverID,
  createEventID,
  getResolver,
} from "../../../utils/helper";
import { ContenthashChanged, IResolver, Resolver } from "../../../types/schema";

/**
 * @dev Event::ContenthashChanged(bytes32 node, bytes hash)
 * @param context trigger object with contains {event: {node ,hash }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ContenthashChangedHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  // Implement your event handler logic for ContenthashChanged here
  const { event, transaction, log } = context;
  let { node, hash } = event;

  node = node.toString();
  hash = hash.toString();

  const resolverDB: Instance = bind(Resolver);
  const resolver: IResolver = await getResolver(
    node,
    log.log_address,
    resolverDB
  );

  resolver.contentHash = hash;
  await resolverDB.save(resolver);

  const ContenthashChangedDB: Instance = bind(ContenthashChanged);
  await ContenthashChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address),
    transactionID: transaction.transaction_hash,
    hash: hash,
  });
};
