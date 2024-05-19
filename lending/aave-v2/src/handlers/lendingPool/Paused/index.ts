import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Paused()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
import {
  ContractToPoolMapping,
  IContractToPoolMapping,
  Pool,
  IPool,
} from "../../../types/schema";
export const PausedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Paused here

  const { event, transaction, block, log } = context;
  const {} = event;

  const address = event.address;
  let poolId = "Not yet defined";
  const poolDB = bind(Pool);
  const contractToPoolMappingDB = bind(ContractToPoolMapping);

  const $contractToPoolMapping = await contractToPoolMappingDB.findOne({
    id: address,
  });
  if ($contractToPoolMapping) poolId = $contractToPoolMapping.pool;

  let $pool: IPool = await poolDB.findOne({ id: poolId });
  if ($pool) {
    $pool.paused = true;
    await poolDB.save($pool);
  }
};
