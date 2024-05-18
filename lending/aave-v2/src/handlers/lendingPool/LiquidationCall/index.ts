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
  LiquidationCall,
  ILiquidationCall,
} from "../../../types/schema";
var BigNumber = require("bignumber.js");

/**
 * @dev Event::LiquidationCall(address collateralAsset, address debtAsset, address user, uint256 debtToCover, uint256 liquidatedCollateralAmount, address liquidator, bool receiveAToken)
 * @param context trigger object with contains {event: {collateralAsset ,debtAsset ,user ,debtToCover ,liquidatedCollateralAmount ,liquidator ,receiveAToken }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const LiquidationCallHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for LiquidationCall here

  const { event, transaction, block, log } = context;
  const {
    collateralAsset,
    debtAsset,
    user,
    debtToCover,
    liquidatedCollateralAmount,
    liquidator,
    receiveAToken,
  } = event;

  let poolId: string;

  const txHash = transaction.transaction_hash.toString();
  const action = "LiquidationCall";
  let contractAddress = log.log_address;

  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const reserveDB = bind(Reserve);
  const userReserveDB = bind(UserReserve);
  const liquidationCallDB = bind(LiquidationCall);

  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: contractAddress });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;

  let collateralreserveId = getReserveId(collateralAsset, poolId);

  let $reserveInstance: IReserve = await reserveDB.findOne({
    id: collateralreserveId,
  });

  if (!$reserveInstance) {
    reserveDB.create({
      id: collateralreserveId,
      underlyingAsset: collateralAsset,
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

  const principaluserReserveId = getUserReserveId(
    user,
    collateralAsset,
    poolId
  );
  let userReserve: IUserReserve = await userReserveDB.findOne({
    id: principaluserReserveId,
  });

  userReserve ??= await userReserveDB.create({
    id: principaluserReserveId,
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

    reserve: collateralreserveId,
  });

  const collateralPoolReserve: IReserve = await reserveDB.findOne({
    id: collateralreserveId,
  });
  const collateralUserReserve: IUserReserve = await userReserveDB.findOne({
    id: principaluserReserveId,
  });

  collateralPoolReserve.lifetimeLiquidated = new BigNumber(
    collateralPoolReserve.lifetimeLiquidated
  )
    .plus(liquidatedCollateralAmount)
    .toString();
  await reserveDB.save(collateralPoolReserve);

  const principalUserReserveId = getUserReserveId(user, debtAsset, poolId);
  const principalPoolReserveId = getReserveId(debtAsset, poolId);

  const liquidationCallID =
    block.block_number.toString() +
    ":" +
    transaction.transaction_index.toString() +
    ":" +
    transaction.transaction_hash.toString() +
    ":" +
    log.log_index.toString() +
    ":" +
    log.log_transaction_index.toString();

  const $liquidationCall = await liquidationCallDB.findOne({
    id: liquidationCallID,
  });
  if (!$liquidationCall) {
    await liquidationCallDB.create({
      id: liquidationCallID,
      txHash: txHash,
      action: "string",
      pool: poolId,
      user: user,
      collateralReserve: collateralPoolReserve.id,
      collateralUserReserve: collateralUserReserve.id,
      collateralAmount: liquidatedCollateralAmount,
      principalReserve: principalPoolReserveId,
      principalUserReserve: principalUserReserveId,
      principalAmount: debtToCover,
      liquidator: liquidator,
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
  poolId: string
): string {
  return userAddress + underlyingAssetAddress + poolId;
}
