import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  createResolverID,
  createEventID,
  getResolver,
} from "../../../utils/helper";
import { InterfaceChanged, Resolver } from "../../../types/schema";

/**
 * @dev Event::InterfaceChanged(bytes32 node, bytes4 interfaceID, address implementer)
 * @param context trigger object with contains {event: {node ,interfaceID ,implementer }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const InterfaceChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for InterfaceChanged here
  const { event, transaction, block, log } = context;
  let { node, interfaceID, implementer } = event;

  node = node.toString();
  interfaceID = interfaceID.toString();
  implementer = implementer.toString();

  await getResolver(node, log.log_address, bind(Resolver));

  const InterfaceChangedDB: Instance = bind(InterfaceChanged);
  await InterfaceChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address).toLowerCase(),
    transactionID: transaction.transaction_hash,
    interfaceID,
    implementer,
  });
};
