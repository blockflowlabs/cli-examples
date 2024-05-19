import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  Reserve,
  IReserve,
  MapAssetPool,
  IMapAssetPool,
} from "../../../types/schema";

/**
 * @dev Event::AssetConfigUpdated(address asset, uint256 emission)
 * @param context trigger object with contains {event: {asset ,emission }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AssetConfigUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for AssetConfigUpdated here

  const { event, transaction, block, log } = context;
  const { asset, emission } = event;

  const reserveDB = bind(Reserve);
  const mapAssetDB = bind(MapAssetPool);

  const $mapAsset:IMapAssetPool = await mapAssetDB.findOne({
    id: asset,
  });
  if (!$mapAsset) {
    console.log("Mapping not initiated for asset: {}", [asset]);
    return;
  }

  const pool = $mapAsset.pool;
  const underlyingAsset = $mapAsset.underlyingAsset;
  let reserveId = getReserveId(underlyingAsset, pool);

  let $reserveInstance: IReserve = await reserveDB.findOne({ id: reserveId });

  if (!$reserveInstance) {
    console.log(
      "Handle asset config updated reserve not created. pool: {} | underlying: {}",
      [pool, underlyingAsset]
    );
    return;
  }

  if (asset == $reserveInstance.aToken) {
    $reserveInstance.aEmissionPerSecond = emission;
    $reserveInstance.aIncentivesLastUpdateTimestamp = Number(block.block_timestamp);
  } else if (asset == $reserveInstance.vToken) {
    $reserveInstance.vEmissionPerSecond = emission;
    $reserveInstance.vIncentivesLastUpdateTimestamp = Number(block.block_timestamp);
  } else if (asset == $reserveInstance.sToken) {
    $reserveInstance.sEmissionPerSecond = emission;
    $reserveInstance.sIncentivesLastUpdateTimestamp = Number(block.block_timestamp);
  }

  await reserveDB.save($reserveInstance);
};

function getReserveId(underlyingAsset: string, poolId: string): string {
  return underlyingAsset + poolId;
}
