import { IEventContext, Instance } from "@blockflow-labs/utils";
import { TextChanged } from "../../../types/schema";
import { TextChangeHelper } from "./helper";

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

  const { event, transaction, block, log } = context;
  let { node, indexedKey, key, value } = event;

  node = node.toString();

  const helper = new TextChangeHelper(bind());

  let resolver = helper.getOrCreateResolver(node, event.address);
};

/**
 * export function handleTextChangedWithValue(
  event: TextChangedWithValueEvent
): void {
  let resolver = getOrCreateResolver(event.params.node, event.address);

  let key = event.params.key;
  if (resolver.texts == null) {
    resolver.texts = [key];
    resolver.save();
  } else {
    let texts = resolver.texts!;
    if (!texts.includes(key)) {
      texts.push(key);
      resolver.texts = texts;
      resolver.save();
    }
  }

  let resolverEvent = new TextChanged(createEventID(event));
  resolverEvent.resolver = createResolverID(event.params.node, event.address);
  resolverEvent.blockNumber = event.block.number.toI32();
  resolverEvent.transactionID = event.transaction.hash;
  resolverEvent.key = event.params.key;
  resolverEvent.value = event.params.value;
  resolverEvent.save();
}
 */
