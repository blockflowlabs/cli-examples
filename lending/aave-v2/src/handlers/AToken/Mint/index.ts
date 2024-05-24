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
  ATokenBalanceHistoryItem,
  IATokenBalanceHistoryItem,
} from "../../../types/schema";

var BigNumber = require("bignumber.js");

/**
 * @dev Event::Mint(address from, uint256 value, uint256 index)
 * @param context trigger object with contains {event: {from ,value ,index }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MintHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Mint here

  const { event, transaction, block, log } = context;
  const { from, value, index } = event;

  const atokenDB = bind(AToken);
  const reserveDB = bind(Reserve);
  let poolId: string;

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

  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: event.address });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;
  const reserve = $atoken.underlyingAssetAddress;
  let reserveId = getReserveId(reserve, poolId);
  const underlyingAsset = reserve;

  let $reserveInstance: IReserve = await reserveDB.findOne({ id: reserveId });

  if (!$reserveInstance) {
    reserveDB.create({
      id: reserveId,
      underlyingAsset: underlyingAsset,
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
  let poolReserve: IReserve = await reserveDB.findOne({ id: reserveId });

  if (from.toString() == "0x464c71f6c2f760dda6093dcb91c24c39e5d6e18c") {
    poolReserve.lifetimeReserveFactorAccrued = new BigNumber(
      poolReserve.lifetimeReserveFactorAccrued.toString(),
    )
      .plus(value.toString())
      .toString();
    reserveDB.save(poolReserve);
  } else {
    const userReserveDB = bind(UserReserve);
    const userReserveId = getUserReserveId(from, underlyingAsset, poolId);
    let userReserve: IUserReserve = await userReserveDB.findOne({
      id: userReserveId,
    });

    userReserve ??= await userReserveDB.create({
      id: userReserveId,
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
    userReserve = await userReserveDB.findOne({
      id: userReserveId,
    });
    let calculatedAmount = rayDiv(value, index);
    userReserve.scaledATokenBalance = new BigNumber(
      userReserve.scaledATokenBalance,
    )
      .plus(calculatedAmount)
      .toString();
    userReserve.currentATokenBalance = rayMul(
      userReserve.scaledATokenBalance,
      index,
    );
    userReserve.liquidityRate = poolReserve.liquidityRate;
    userReserve.variableBorrowIndex = poolReserve.variableBorrowIndex;

    userReserve.lastUpdateTimestamp = Date.parse(block.block_timestamp) / 1000; //@prady

    poolReserve.totalDeposits = new BigNumber(
      poolReserve.totalDeposits.toString(),
    )
      .plus(value.toString())
      .toString();
    poolReserve.availableLiquidity = new BigNumber(
      poolReserve.availableLiquidity,
    )
      .plus(value.toString())
      .toString();
    poolReserve.totalLiquidity = new BigNumber(poolReserve.totalLiquidity)
      .plus(value.toString())
      .toString();
    poolReserve.lifetimeLiquidity = new BigNumber(poolReserve.lifetimeLiquidity)
      .plus(value.toString())
      .toString();

    if (userReserve.usageAsCollateralEnabledOnUser) {
      poolReserve.totalLiquidityAsCollateral = new BigNumber(
        poolReserve.totalLiquidityAsCollateral,
      )
        .plus(value.toString())
        .toString();
    }
    reserveDB.save(poolReserve);
    userReserveDB.save(userReserve);
  }
};

function getReserveId(underlyingAsset: string, poolId: string): string {
  return underlyingAsset + poolId;
}

function getUserReserveId(
  userAddress: string,
  underlyingAssetAddress: string,
  poolId: string,
): string {
  return userAddress + underlyingAssetAddress + poolId;
}

function rayDiv(_a: String, _b: String): String {
  let a = new BigNumber(_a);
  let b = new BigNumber(_b);
  let halfB = b.div(2);
  let result = a.mul(new BigNumber("1000000000000000000000000000"));
  result = result.add(halfB);
  let division = result.div(b);
  return division.toString();
}

function rayMul(_a: string, _b: string): string {
  let a = new BigNumber(_a);
  let b = new BigNumber(_b);
  const RAY = BigNumber.from("1000000000000000000000000000");
  const halfRAY = RAY.div(2);
  let result = a.mul(b);
  result = result.add(halfRAY);
  let mult = result.div(RAY);
  return mult;
}
