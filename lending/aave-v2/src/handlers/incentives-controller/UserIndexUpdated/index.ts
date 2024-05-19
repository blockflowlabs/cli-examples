import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  Reserve,
  IReserve,
  UserReserve,
  IUserReserve,
  MapAssetPool,
  IMapAssetPool,
} from "../../../types/schema";
/**
 * @dev Event::UserIndexUpdated(address user, address asset, uint256 index)
 * @param context trigger object with contains {event: {user ,asset ,index }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserIndexUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for UserIndexUpdated here

  const { event, transaction, block, log } = context;
  const { user, asset, index } = event;

  const reserveDB = bind(Reserve);
  const mapAssetDB = bind(MapAssetPool);
  const userReserveDB = bind(UserReserve);

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
      "UserIndex updated reserve not created. user: {} | pool: {} | underlying: {} | asset: {} ",
      [user, pool, underlyingAsset, asset]
    );
    return;
  }

  const userReserveId = getUserReserveId(user, underlyingAsset, pool);
  let userReserve: IUserReserve = await userReserveDB.findOne({
    id: userReserveId,
  });

  userReserve ??= await userReserveDB.create({
    id: userReserveId,
    pool: pool,
    usageAsCollateralEnabledOnUser: false,
    scaledATokenBalance: "0",
    scaledVariableDebt: "0",
    principalStableDebt: "0",
    currentATokenBalance: "0",
    currentVariableDebt: "0",
    currentStableDebt: "0",
    stableBorrowRate: "0",
    oldStableBorrowRate: "0",
    currentTotalDebt: "0",
    variableBorrowIndex: "0",
    lastUpdateTimestamp: 0,
    liquidityRate: "0",
    stableBorrowLastUpdateTimestamp: 0,

    // incentives
    aTokenincentivesUserIndex: "0",
    vTokenincentivesUserIndex: "0",
    sTokenincentivesUserIndex: "0",
    aIncentivesLastUpdateTimestamp: 0,
    vIncentivesLastUpdateTimestamp: 0,
    sIncentivesLastUpdateTimestamp: 0,
    user: user,

    reserve: reserveId,
  });

  userReserve = await userReserveDB.findOne({
    id: userReserveId,
  });

  if (userReserve != null && $reserveInstance != null) {
    if (asset == $reserveInstance.aToken) {
      userReserve.aTokenincentivesUserIndex = index;
      userReserve.aIncentivesLastUpdateTimestamp = Number(
        block.block_timestamp
      );
    } else if (asset == $reserveInstance.vToken) {
      userReserve.vTokenincentivesUserIndex = index;
      userReserve.vIncentivesLastUpdateTimestamp = Number(
        block.block_timestamp
      );
    } else if (asset == $reserveInstance.sToken) {
      userReserve.sTokenincentivesUserIndex = index;
      userReserve.sIncentivesLastUpdateTimestamp = Number(
        block.block_timestamp
      );
    }

    await userReserveDB.save(userReserve);
  }
};

function getReserveId(underlyingAsset: string, poolId: string): string {
  return underlyingAsset + poolId;
}

function getUserReserveId(
  userAddress: string,
  underlyingAssetAddress: string,
  poolId: string
): string {
  return userAddress + underlyingAssetAddress + poolId;
}
