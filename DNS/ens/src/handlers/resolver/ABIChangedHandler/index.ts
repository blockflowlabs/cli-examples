import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  createResolverID,
  createEventID,
  getResolver,
} from "../../../utils/helper";
import { AbiChanged, Resolver } from "../../../types/schema";

/**
 * @dev Event::ABIChanged(bytes32 node, uint256 contentType)
 * @param context trigger object with contains {event: {node ,contentType }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ABIChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for ABIChanged here
  const { event, transaction, log } = context;
  let { node, contentType } = event;

  node = node.toString();
  contentType = contentType.toString();

  const AbiChangedDB: Instance = bind(AbiChanged);
  await getResolver(node, log.log_address, bind(Resolver));

  await AbiChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address).toLowerCase(),
    transactionID: transaction.transaction_hash,
    contentType,
  });
};
