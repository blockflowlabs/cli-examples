import { IEventContext } from "@blockflow-labs/utils";

import { ContenthashChangeHelper } from "./helper";
import { ContenthashChanged, Resolver } from "../../../types/schema";

/**
 * @dev Event::ContenthashChanged(bytes32 node, bytes hash)
 * @param context trigger object with contains {event: {node ,hash }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ContenthashChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for ContenthashChanged here

  const { event, transaction, block, log } = context;
  let { node, hash } = event;

  node = node.toString();
  hash = hash.toString();

  const helper = new ContenthashChangeHelper(
    bind(Resolver),
    bind(ContenthashChanged)
  );

  let resolver = await helper.getOrCreateResolver(
    node,
    transaction.transaction_to_address
  );
  resolver.contentHash = hash;
  await helper.saveResolver(resolver);

  let resolverEvent = await helper.createContentHashChanged(
    helper.createEventID(context)
  );
  resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address
  );
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.hash = hash;
  await helper.saveContentHashChanged(resolverEvent);
};
