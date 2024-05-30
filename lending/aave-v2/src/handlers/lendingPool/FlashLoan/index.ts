import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
var BigNumber = require("bignumber.js");

import {
  ContractToPoolMapping,
  Reserve,
  IContractToPoolMapping,
  IReserve,
  FlashLoan,
  IFlashLoan,
} from "../../../types/schema";

/**
 * @dev Event::FlashLoan(address target, address initiator, address asset, uint256 amount, uint256 premium, uint16 referralCode)
 * @param context trigger object with contains {event: {target ,initiator ,asset ,amount ,premium ,referralCode }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FlashLoanHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for FlashLoan here

  const { event, transaction, block, log } = context;
  const { target, initiator, asset, amount, premium, referralCode } = event;

  const reserveDB = bind(Reserve);
  const contractToPoolMappingDB = bind(ContractToPoolMapping);
  const flashloanDB = bind(FlashLoan);

  let poolId: string;

  const contractToPoolMapping: IContractToPoolMapping =
    await contractToPoolMappingDB.findOne({ id: event.address });

  if (!contractToPoolMapping) poolId = "not yet defined";
  else poolId = contractToPoolMapping.pool;

  let reserveId = getReserveId(asset, poolId);
  let $reserveInstance: IReserve = await reserveDB.findOne({ id: reserveId });

  if (!$reserveInstance) {
    reserveDB.create({
      id: reserveId,
      underlyingAsset: asset,
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

  let poolReserve = await reserveDB.findOne({ id: reserveId });
  poolReserve.availableLiquidity = new BigNumber(poolReserve.availableLiquidity)
    .plus(premium)
    .toString();

  poolReserve.lifetimeFlashLoans = new BigNumber(poolReserve.lifetimeFlashLoans)
    .plus(amount)
    .toString();

  poolReserve.lifetimeFlashLoanPremium = new BigNumber(
    poolReserve.lifetimeFlashLoanPremium,
  )
    .plus(premium)
    .toString();
  poolReserve.totalATokenSupply = new BigNumber(poolReserve.totalATokenSupply)
    .plus(premium)
    .toString();

  await reserveDB.save(poolReserve);

  const flashloanId =
    block.block_number.toString() +
    ":" +
    transaction.transaction_index.toString() +
    ":" +
    transaction.transaction_hash.toString() +
    ":" +
    log.log_index.toString() +
    ":" +
    log.log_transaction_index.toString();

  const $flashloan = await flashloanDB.findOne({ id: flashloanId });
  if (!$flashloan) {
    await flashloanDB.create({
      id: flashloanId,
      pool: poolReserve.pool,
      reserve: poolReserve.id,
      target: target,
      initiator: initiator,
      totalFee: premium,
      amount: amount,
      timestamp: block.block_timestamp,
    });
  }
};

function getReserveId(underlyingAsset: string, poolId: string): string {
  return underlyingAsset + poolId;
}
