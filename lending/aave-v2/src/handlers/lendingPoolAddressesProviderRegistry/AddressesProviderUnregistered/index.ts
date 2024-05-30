import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Pool, IPool } from "../../../types/schema";

/**
 * @dev Event::AddressesProviderUnregistered(address newAddress)
 * @param context trigger object with contains {event: {newAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddressesProviderUnregisteredHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AddressesProviderUnregistered here

  const { event, transaction, block, log } = context;
  const { newAddress } = event;

  const address = newAddress.toString();
  const poolDB = bind(Pool);

  let $pool: IPool = await poolDB.findOne({ id: address });
  if ($pool != null) {
    $pool.active = false;
    await poolDB.save($pool);
  }
};
