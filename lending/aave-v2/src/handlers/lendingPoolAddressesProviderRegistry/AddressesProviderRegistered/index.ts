import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Protocol, IProtocol, Pool, IPool } from "../../../types/schema";
/**
 * @dev Event::AddressesProviderRegistered(address newAddress)
 * @param context trigger object with contains {event: {newAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddressesProviderRegisteredHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AddressesProviderRegistered here

  const { event, transaction, block, log } = context;
  const { newAddress } = event;

  let protocolId = "1";
  let protocolDB = bind(Protocol);
  let poolDB = bind(Pool);

  let $protocol: IProtocol = await protocolDB.findOne({ id: protocolId });
  if (!$protocol) {
    await protocolDB.create({
      id: protocolId,
    });
  }

  $protocol = await protocolDB.findOne({ id: protocolId });
  let address = newAddress.toString();
  let $pool: IPool = await poolDB.findOne({ id: address });
  if (!$pool) {
    await poolDB.create({
      id: address,
      protocol: $protocol.id,
      active: true,
      paused: false,
      lastUpdateTimestamp: Date.parse(block.block_timestamp) / 1000, //@prady
    });
  }
};
