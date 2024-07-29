import { IEventContext, Instance } from "@blockflow-labs/utils";

import { createEventID, getResolver } from "../../../utils/helper";
import { TextChanged, Resolver, IResolver } from "../../../types/schema";

/**
 * @dev Event::TextChanged(bytes32 node, string indexedKey, string key)
 * @param context trigger object with contains {event: {node ,indexedKey ,key ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TextChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for TextChanged here
  const { event, transaction, log } = context;
  let { node, indexedKey, key } = event;

  node = node.toString();
  key = key.toString();

  const resolverDB: Instance = bind(Resolver);
  const resolver: IResolver = await getResolver(
    node,
    log.log_address,
    resolverDB,
  );

  //  @ts-ignore
  if (resolver.texts.length === 0) resolver.texts = [key];
  else if (!resolver.texts.includes(key)) resolver.texts.push(key);

  await resolverDB.save(resolver);

  const TextChangedDB: Instance = bind(TextChanged);
  await TextChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: resolver.id,
    transactionID: transaction.transaction_hash,
    key,
  });
};
