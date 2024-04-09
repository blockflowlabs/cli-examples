import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  createResolverID,
  createEventID,
  getResolver,
} from "../../../utils/helper";
import { PubkeyChanged, Resolver } from "../../../types/schema";
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
  const { event, transaction, log } = context;
  let { node, x, y } = event;

  x = x.toString();
  y = y.toString();
  node = node.toString();

  await getResolver(node, log.log_address, bind(Resolver));

  const PubkeyChangedDB: Instance = bind(PubkeyChanged);

  await PubkeyChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address).toLowerCase(),
    transactionID: transaction.transaction_hash,
    x,
    y,
  });
};
