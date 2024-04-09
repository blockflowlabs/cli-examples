import { IEventContext } from "@blockflow-labs/utils";

import { InterfaceChangeHelper } from "./helper";
import { InterfaceChanged } from "../../../types/schema";

/**
 * @dev Event::InterfaceChanged(bytes32 node, bytes4 interfaceID, address implementer)
 * @param context trigger object with contains {event: {node ,interfaceID ,implementer }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const InterfaceChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for InterfaceChanged here

  const { event, transaction, block, log } = context;
  let { node, interfaceID, implementer } = event;

  interfaceID = interfaceID.toString();
  implementer = implementer.toString();

  const helper = new InterfaceChangeHelper(bind(InterfaceChanged));

  let resolverEvent = await helper.createInterfaceChanged(
    helper.createEventID(context),
  );

  resolverEvent.resolver = helper.createResolverID(
    node,
    transaction.transaction_to_address,
  );
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.interfaceID = interfaceID;
  resolverEvent.implementer = implementer;

  await helper.saveInterfaceChanged(resolverEvent);
};
