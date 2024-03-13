import { IEventContext } from "@blockflow-labs/utils";

import { AddressChangeHelper } from "./helper";
import { MulticoinAddrChanged, Resolver } from "../../../types/schema";

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

  const { event, transaction } = context;
  let { node, coinType, newAddress } = event;

  node = node.toString();
  coinType = coinType.toString();
  newAddress = newAddress.toString();

  const helper = new AddressChangeHelper(
    bind(Resolver),
    bind(MulticoinAddrChanged)
  );

  let resolver = await helper.getOrCreateResolver(
    node,
    transaction.transaction_to_address
  );

  if (!resolver.coinTypes) {
    resolver.coinTypes = [coinType];
    await helper.saveResolver(resolver);
  } else {
    if (!resolver.coinTypes.includes(coinType)) {
      resolver.texts.push(coinType);
      await helper.saveResolver(resolver);
    }
  }

  let resolverEvent = await helper.createAddressChanged(
    helper.createEventID(context)
  );
  resolverEvent.resolver = resolver.id.toLowerCase();
  resolverEvent.blockNumber = context.block.block_number;
  resolverEvent.transactionID = context.transaction.transaction_hash;
  resolverEvent.coinType = coinType;
  resolverEvent.addr = newAddress;
  await helper.saveAddressChanged(resolverEvent);
};
