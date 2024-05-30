import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  AToken,
  IAToken,
  Reserve,
  IUserReserve,
  IReserve,
  UserReserve,
  ContractToPoolMapping,
  IContractToPoolMapping,
} from "../../../types/schema";

import { BurnHandler } from "../Burn";
import { MintHandler } from "../Mint";
/**
 * @dev Event::BalanceTransfer(address from, address to, uint256 value, uint256 index)
 * @param context trigger object with contains {event: {from ,to ,value ,index }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BalanceTransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BalanceTransfer here

  const { event, transaction, block, log } = context;
  const { from, to, value, index } = event;
  let poolId: string;
  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const atokenDB = bind(AToken);
  const reserveDB = bind(Reserve);
  const userReserveDB = bind(UserReserve);

  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: event.address });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;

  BurnHandler(context, bind, secrets);
  MintHandler(context, bind, secrets);

  let $atoken: IAToken = await atokenDB.findOne({
    id: event.address.toString(),
  });
  if (!$atoken) {
    await atokenDB.create({
      id: event.address,
      underlyingAssetAddress: "1",
      tokenContractImpl: "0x0000000000000000000000000000000000000000",
      pool: "",
      underlyingAssetDecimals: 18,
    });
  }
  $atoken = await atokenDB.findOne({ id: event.address.toString() });

  const reserveId = getReserveId($atoken.underlyingAssetAddress, poolId);

  const touserReserveId = getUserReserveId(
    to,
    $atoken.underlyingAssetAddress,
    poolId,
  );
  let userReserve: IUserReserve = await userReserveDB.findOne({
    id: touserReserveId,
  });

  userReserve ??= await userReserveDB.create({
    id: touserReserveId,
    pool: poolId,
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
    user: from,

    reserve: reserveId,
  });

  const fromuserReserveId = getUserReserveId(
    to,
    $atoken.underlyingAssetAddress,
    poolId,
  );
  userReserve = await userReserveDB.findOne({
    id: touserReserveId,
  });

  userReserve ??= await userReserveDB.create({
    id: fromuserReserveId,
    pool: poolId,
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
    user: from,

    reserve: reserveId,
  });

  let $reserveInstance: IReserve = await reserveDB.findOne({ id: reserveId });

  if (!$reserveInstance) {
    reserveDB.create({
      id: reserveId,
      underlyingAsset: $atoken.underlyingAssetAddress,
      pool: poolId,
      symbol: "",
      name: "",
      decimals: 0,
      usageAsCollateralEnabled: false,
      borrowingEnabled: false,
      stableBorrowRateEnabled: false,
      isActive: false,
      isFrozen: false,
      baseLTVasCollateral: "0",
      reserveLiquidationThreshold: "0",
      reserveLiquidationBonus: "0",
      reserveInterestRateStrategy: "1",
      baseVariableBorrowRate: "0",
      optimalUtilisationRate: "0",
      variableRateSlope1: "0",
      variableRateSlope2: "0",
      stableRateSlope1: "0",
      stableRateSlope2: "0",
      utilizationRate: "0",
      totalLiquidity: "0",
      totalATokenSupply: "0",
      totalLiquidityAsCollateral: "0",
      availableLiquidity: "0",
      liquidityRate: "0",
      variableBorrowRate: "0",
      stableBorrowRate: "0",
      averageStableRate: "0", // TODO: where do i get this?
      liquidityIndex: "0",
      variableBorrowIndex: "0",
      reserveFactor: "0", // TODO: is default 0?
      aToken: "0x0000000000000000000000000000000000000000",
      vToken: "0x0000000000000000000000000000000000000000",
      sToken: "0x0000000000000000000000000000000000000000",

      // incentives
      aEmissionPerSecond: "0",
      vEmissionPerSecond: "0",
      sEmissionPerSecond: "0",
      aTokenIncentivesIndex: "0",
      vTokenIncentivesIndex: "0",
      sTokenIncentivesIndex: "0",
      aIncentivesLastUpdateTimestamp: 0,
      vIncentivesLastUpdateTimestamp: 0,
      sIncentivesLastUpdateTimestamp: 0,

      totalScaledVariableDebt: "0",
      totalCurrentVariableDebt: "0",
      totalPrincipalStableDebt: "0",
      totalDeposits: "0",

      lifetimePrincipalStableDebt: "0",
      lifetimeScaledVariableDebt: "0",
      lifetimeCurrentVariableDebt: "0",

      lifetimeLiquidity: "0",
      lifetimeBorrows: "0",
      lifetimeRepayments: "0",
      lifetimeWithdrawals: "0",
      lifetimeLiquidated: "0",
      lifetimeFlashLoans: "0",
      lifetimeFlashLoanPremium: "0",

      stableDebtLastUpdateTimestamp: 0,
      lastUpdateTimestamp: 0,

      lifetimeReserveFactorAccrued: "0",
      lifetimeDepositorsInterestEarned: "0",
    });
  }

  let userFromReserve = await userReserveDB.findOne({ id: fromuserReserveId });
  let userToReserve = await userReserveDB.findOne({ id: touserReserveId });
  let reserve = await reserveDB.findOne({ id: reserveId });

  if (
    userFromReserve.usageAsCollateralEnabledOnUser &&
    !userToReserve.usageAsCollateralEnabledOnUser
  ) {
    reserve.totalLiquidityAsCollateral =
      reserve.totalLiquidityAsCollateral.minus(event.params.value);
    reserveDB.save(reserve);
  } else if (
    !userFromReserve.usageAsCollateralEnabledOnUser &&
    userToReserve.usageAsCollateralEnabledOnUser
  ) {
    reserve.totalLiquidityAsCollateral =
      reserve.totalLiquidityAsCollateral.plus(event.params.value);
    reserveDB.save(reserve);
  }
};

function getUserReserveId(
  userAddress: string,
  underlyingAssetAddress: string,
  poolId: string,
): string {
  return userAddress + underlyingAssetAddress + poolId;
}

function getReserveId(underlyingAsset: string, poolId: string): string {
  return underlyingAsset + poolId;
}
