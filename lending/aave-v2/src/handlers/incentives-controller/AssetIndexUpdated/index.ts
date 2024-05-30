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
 * @dev Event::AssetIndexUpdated(address asset, uint256 index)
 * @param context trigger object with contains {event: {asset ,index }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AssetIndexUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AssetIndexUpdated here

  const { event, transaction, block, log } = context;
  const { asset, index } = event;

  const reserveDB = bind(Reserve);
  const mapAssetDB = bind(MapAssetPool);

  const $mapAsset: IMapAssetPool = await mapAssetDB.findOne({
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
      "Handle asset index updated reserve not created. pool: {} | underlying: {}",
      [pool, underlyingAsset],
    );
    return;
  }
  if (asset == $reserveInstance.aToken) {
    $reserveInstance.aTokenIncentivesIndex = index;
    $reserveInstance.aIncentivesLastUpdateTimestamp = Number(
      block.block_timestamp,
    );
  } else if (asset == $reserveInstance.vToken) {
    $reserveInstance.vTokenIncentivesIndex = index;
    $reserveInstance.vIncentivesLastUpdateTimestamp = Number(
      block.block_timestamp,
    );
  } else if (asset == $reserveInstance.sToken) {
    $reserveInstance.sTokenIncentivesIndex = index;
    $reserveInstance.sIncentivesLastUpdateTimestamp = Number(
      block.block_timestamp,
    );
  }

  await reserveDB.save($reserveInstance);
};

function getReserveId(underlyingAsset: string, poolId: string): string {
  return underlyingAsset + poolId;
}
