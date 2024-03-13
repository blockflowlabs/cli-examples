import { IEventContext } from "@blockflow-labs/utils";

import { AbiChangeHelper } from "./helper";
import { AbiChanged } from "../../../types/schema";

/**
 * @dev Event::ABIChanged(bytes32 node, uint256 contentType)
 * @param context trigger object with contains {event: {node ,contentType }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ABIChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for ABIChanged here

  const { event, transaction } = context;
  let { node, contentType } = event;

  node = node.toString();

  const helper = new AbiChangeHelper(bind(AbiChanged));

  let resolverEvent = await helper.createAbiChanged(
    helper.createEventID(context)
  );
  resolverEvent.resolver = resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address
  );
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.contentType = contentType;
  await helper.saveAbiChanged(resolverEvent);
};
