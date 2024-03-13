import { IEventContext } from "@blockflow-labs/utils";

import { TextChangeHelper } from "./helper";
import { TextChanged, Resolver } from "../../../types/schema";

/**
 * @dev Event::TextChanged(bytes32 node, string indexedKey, string key, string value)
 * @param context trigger object with contains {event: {node ,indexedKey ,key ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TextChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for TextChanged here
  const { event, transaction } = context;
  let { node, indexedKey, key, value } = event;

  node = node.toString();
  key = key.toString();
  value = value.toString();

  const helper = new TextChangeHelper(bind(Resolver), bind(TextChanged));

  let resolver = await helper.getOrCreateResolver(
    node,
    transaction.transaction_to_address
  );

  if (!resolver.texts || resolver.texts.length === 0) {
    resolver.texts = [key];
    await helper.saveResolver(resolver);
  } else {
    if (!resolver.texts.includes(key)) {
      resolver.texts.push(key);
      await helper.saveResolver(resolver);
    }
  }

  let resolverEvent = await helper.createTextChanged(
    helper.createEventID(context)
  );

  resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address
  );
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.key = key;
  resolverEvent.value = value;
  await helper.saveTextChanged(resolverEvent);
};
