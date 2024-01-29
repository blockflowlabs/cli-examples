import { IEventContext } from "@blockflow-labs/utils";

import { PubkeyChangeHelper } from "./helper";
import { PubkeyChanged } from "../../../types/schema";
/**
 * @dev Event::PubkeyChanged(bytes32 node, bytes32 x, bytes32 y)
 * @param context trigger object with contains {event: {node ,x ,y }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PubkeyChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for PubkeyChanged here
  const { event, transaction } = context;
  let { node, x, y } = event;

  x = x.toString();
  y = y.toString();
  node = node.toString();

  const helper = new PubkeyChangeHelper(bind(PubkeyChanged));

  let resolverEvent = await helper.createPubkeyChanged(
    helper.createEventID(context)
  );
  resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address
  );

  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.x = x;
  resolverEvent.y = y;
  await helper.savePubkeyChanged(resolverEvent);
};
