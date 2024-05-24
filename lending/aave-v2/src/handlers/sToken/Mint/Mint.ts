import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  SToken,
  ISToken,
  Reserve,
  IUserReserve,
  IReserve,
  UserReserve,
  ContractToPoolMapping,
  IContractToPoolMapping,
  User,
  IUser,
} from "../../../types/schema";
var BigNumber = require("bignumber.js");

/**
 * @dev Event::Mint(address user, address onBehalfOf, uint256 amount, uint256 currentBalance, uint256 balanceIncrease, uint256 newRate, uint256 avgStableRate, uint256 newTotalSupply)
 * @param context trigger object with contains {event: {user ,onBehalfOf ,amount ,currentBalance ,balanceIncrease ,newRate ,avgStableRate ,newTotalSupply }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MintHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Mint here

  const { event, transaction, block, log } = context;
  const {
    user,
    onBehalfOf,
    amount,
    currentBalance,
    balanceIncrease,
    newRate,
    avgStableRate,
    newTotalSupply,
  } = event;

  let borrowedAmount = amount.toString();
  let stokenDB = bind(SToken);
  let userDB = bind(User);

  let from = user.toString();
  if (from != onBehalfOf.toString()) from = onBehalfOf.toString();

  let $stoken: ISToken = await stokenDB.findOne({
    id: event.address.toString(),
  });
  if (!$stoken) {
    await stokenDB.create({
      id: event.address.toString(),
      underlyingAssetAddress: "1",
      tokenContractImpl: "0x0000000000000000000000000000000000000000",
      pool: "",
      underlyingAssetDecimals: 18,
    });
  }
  $stoken = await stokenDB.findOne({ id: event.address.toString() });
  let poolId: string;
  const reserveDB = bind(Reserve);
  const userReserveDB = bind(UserReserve);
  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: event.address });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;

  const reserve = $stoken.underlyingAssetAddress;
  let reserveId = getReserveId(reserve, poolId);
  const underlyingAsset = reserve;

  let $reserveInstance: IReserve = await reserveDB.findOne({ id: reserveId });

  if (!$reserveInstance) {
    reserveDB.create({
      id: reserveId,
      underlyingAsset: underlyingAsset.toString(),
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
    user: from.toString(),

    reserve: reserveId,
  });

  let poolReserve: IReserve = await reserveDB.findOne({ id: reserveId });
  userReserve = await userReserveDB.findOne({
    id: userReserveId,
  });

  let $user: IUser = await userDB.findOne({ id: from.toString() });
  if (!$user) {
    await userDB.create({
      id: from.toString(),
      borrowedReservesCount: 0,
      unclaimedRewards: "0",
      incentivesLastUpdated: 0,
      lifetimeRewards: "0",
    });
  }
  $user = await userDB.findOne({ id: from.toString() });

  if (
    userReserve.scaledVariableDebt == "0" &&
    userReserve.principalStableDebt == "0"
  ) {
    $user.borrowedReservesCount += 1;
    await userDB.save($user);
  }

  let calculatedAmount = new BigNumber(amount.toString())
    .plus(balanceIncrease.toString())
    .toString();
  poolReserve.totalPrincipalStableDebt = newTotalSupply.toString();
  poolReserve.lifetimePrincipalStableDebt = new BigNumber(
    poolReserve.lifetimePrincipalStableDebt.toString(),
  )
    .plus(calculatedAmount.toString())
    .toString();

  poolReserve.averageStableRate = avgStableRate.toString();
  poolReserve.lifetimeBorrows = new BigNumber(
    poolReserve.lifetimeBorrows.toString(),
  )
    .plus(borrowedAmount.toString())
    .toString();

  poolReserve.availableLiquidity = new BigNumber(
    poolReserve.availableLiquidity.toString(),
  )
    .minus(borrowedAmount.toString())
    .toString();

  poolReserve.totalLiquidity = new BigNumber(
    poolReserve.totalLiquidity.toString(),
  )
    .plus(balanceIncrease.toString())
    .toString();
  poolReserve.stableDebtLastUpdateTimestamp =
    Date.parse(block.block_timestamp) / 1000; //@prady

  await reserveDB.save(poolReserve);

  userReserve.principalStableDebt = new BigNumber(
    userReserve.principalStableDebt.toString(),
  )
    .plus(calculatedAmount.toString())
    .toString();
  userReserve.currentStableDebt = userReserve.principalStableDebt;
  userReserve.currentTotalDebt = new BigNumber(userReserve.currentStableDebt)
    .plus(userReserve.currentVariableDebt.toString())
    .toString();

  userReserve.oldStableBorrowRate = userReserve.stableBorrowRate;
  userReserve.stableBorrowRate = newRate.toString();
  userReserve.liquidityRate = poolReserve.liquidityRate;
  userReserve.variableBorrowIndex = poolReserve.variableBorrowIndex;

  userReserve.stableBorrowLastUpdateTimestamp =
    Date.parse(block.block_timestamp) / 1000; //@prady

  userReserve.lastUpdateTimestamp = Date.parse(block.block_timestamp) / 1000; //@prady
  await userReserveDB.save(userReserve);
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
