import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  ContractToPoolMapping,
  Reserve,
  IContractToPoolMapping,
  IReserve,
  UserReserve,
  IUserReserve,
  Swap,
  ISwap,
} from "../../../types/schema";
/**
 * @dev Event::Swap(address reserve, address user, uint256 rateMode)
 * @param context trigger object with contains {event: {reserve ,user ,rateMode }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SwapHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Swap here

  const { event, transaction, block, log } = context;
  const { reserve, user, rateMode } = event;

  let poolId: string;

  const txHash = transaction.transaction_hash.toString();
  const action = "Swap";
  let contractAddress = log.log_address;

  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const reserveDB = bind(Reserve);
  const userReserveDB = bind(UserReserve);
  const swapDB = bind(Swap);

  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: contractAddress });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;

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

  const userReserveId = getUserReserveId(user, underlyingAsset, poolId);
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
    user: user,

    reserve: reserveId,
  });

  const poolReserve: IReserve = await reserveDB.findOne({ id: reserveId });

  const swapId =
    block.block_number.toString() +
    ":" +
    transaction.transaction_index.toString() +
    ":" +
    transaction.transaction_hash.toString() +
    ":" +
    log.log_index.toString() +
    ":" +
    log.log_transaction_index.toString();

  const $swap: ISwap = await swapDB.findOne({});
  if (!$swap) {
    await swapDB.create({
      id: swapId,
      txHash: transaction.transaction_hash,
      action: action,
      pool: poolReserve.pool,
      borrowRateModeFrom: getBorrowRateMode(rateMode.toString()),
      borrowRateModeTo:
        getBorrowRateMode(rateMode) === "BORROW_MODE_STABLE"
          ? "BORROW_MODE_VARIABLE"
          : "BORROW_MODE_STABLE",
      variableBorrowRate: poolReserve.variableBorrowRate,
      stableBorrowRate: poolReserve.stableBorrowRate,
      user: userReserve.user,
      userReserve: userReserve.id,
      reserve: poolReserve.id,
      timestamp: block.block_timestamp,
    });
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

function getBorrowRateMode(mode: string): string {
  if (mode == "0") {
    return "BORROW_MODE_NONE";
  } else if (mode == "1") {
    return "BORROW_MODE_STABLE";
  } else if (mode == "2") {
    return "BORROW_MODE_VARIABLE";
  }
  return "INVALID!";
}
