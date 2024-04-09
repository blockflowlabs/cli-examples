import { IEventContext, Instance } from "@blockflow-labs/utils";

import {
  IResolver,
  MulticoinAddrChanged,
  Resolver,
} from "../../../types/schema";
import {
  createResolverID,
  createEventID,
  getResolver,
} from "../../../utils/helper";

/**
 * @dev Event::AddressChanged(bytes32 node, uint256 coinType, bytes newAddress)
 * @param context trigger object with contains {event: {node ,coinType ,newAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddressChangedHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for AddressChanged here
  const { event, transaction, log } = context;
  let { node, coinType, newAddress } = event;

  node = node.toString();
  coinType = coinType.toString();
  newAddress = newAddress.toString();

  const resolverDB: Instance = bind(Resolver);
  const resolver: IResolver = await getResolver(
    node,
    log.log_address,
    resolverDB
  );

  // since coinTypes is of type [Number]
  // @ts-ignore
  if (resolver.coinTypes.length === 0) resolver.coinTypes = [coinType];
  else if (!resolver.coinTypes.includes(coinType))
    resolver.coinTypes.push(coinType);

  await resolverDB.save(resolver);

  const MulticoinAddrChangedDB: Instance = bind(MulticoinAddrChanged);
  await MulticoinAddrChangedDB.create({
    id: createEventID(context).toLowerCase(),
    resolver: createResolverID(node, log.log_address),
    transactionID: transaction.transaction_hash,
    coinType: coinType,
    addr: newAddress,
  });
};
