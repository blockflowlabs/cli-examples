import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  createResolverID,
  createEventID,
  getResolver,
} from "../../../utils/helper";
import { NameChanged, Resolver } from "../../../types/schema";
import { NameChangeHelper } from "./helper";

/**
 * @dev Event::NameChanged(bytes32 node, string name)
 * @param context trigger object with contains {event: {node ,name }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for NameChanged here
  const { event, transaction, log } = context;
  let { node, name } = event;

  node = node.toString();
  name = name.toString();

  if (name.indexOf("\u0000") != -1) return;
  await getResolver(node, log.log_address, bind(Resolver));

  const NameChangedDB: Instance = bind(NameChanged);

  await NameChangedDB.create({
    id: createResolverID(node, log.log_address).toLowerCase(),
    transactionID: transaction.transaction_hash,
    name,
  });
};
