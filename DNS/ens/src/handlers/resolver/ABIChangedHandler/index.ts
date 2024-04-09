import { IEventContext, Instance } from "@blockflow-labs/utils";

import { AbiChanged, Resolver } from "../../../types/schema";
import { createResolverID, createEventID } from "../../../utils/helper";

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
  const { event, transaction, log } = context;
  let { node, contentType } = event;

  node = node.toString();
  contentType = contentType.toString();

  const AbiChangedDB: Instance = bind(AbiChanged);
  createResolver(node, log.log_address, bind(Resolver));

  await AbiChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address).toLowerCase(),
    transactionID: transaction.transaction_hash,
    contentType,
  });
};

async function createResolver(
  node: string,
  address: string,
  resolverDB: Instance
) {
  let id = createResolverID(node, address);
  let resolver = await resolverDB.findOne({ id: id.toLowerCase() });

  resolver ??= await resolverDB.create({
    id: id.toLowerCase(),
    domain: node,
    address: address,
  });

  return resolver;
}
