import { IEventContext } from "@blockflow-labs/utils";

import { NameChanged } from "../../../types/schema";
import { NameChangeHelper } from "./helper";

/**
 * @dev Event::NameChanged(bytes32 node, string name)
 * @param context trigger object with contains {event: {node ,name }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NameChanged here
  const { event, transaction } = context;
  let { node, name } = event;

  node = node.toString();
  name = name.toString();

  if (name.indexOf("\u0000") != -1) return;
  const helper = new NameChangeHelper(bind(NameChanged));

  let resolverEvent = await helper.createNameChanged(
    helper.createEventID(context),
  );

  resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address,
  );
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.name = name;
  await helper.saveTextChanged(resolverEvent);
};
