import { String, Array } from "@blockflow-labs/utils";

export interface Protocol {
  id: String;
  pools: [string];
}

export interface ContractToPoolMapping {
  id: string;
  pool: string;
}

export interface PoolConfigurationHistoryItem {
  id: string;
  active: Boolean;
  pool: string;
  lendingPool: string;
  lendingPoolCollateralManager: string;
  lendingPoolConfiguratorImpl: string;
  lendingPoolImpl: string;
  lendingPoolConfigurator: string;
  proxyPriceProvider: string;
  lendingRateOracle: string;
  configurationAdmin: string;
  timestamp: string;
}

export interface Pool {
  id: string;
  protocol: string;
  lendingPool: string;
  lendingPoolCollateralManager: string;
  lendingPoolConfiguratorImpl: string;
  lendingPoolImpl: string;
  lendingPoolConfigurator: string;
  proxyPriceProvider: string;
  lendingRateOracle: string;
  configurationAdmin: string;
  ethereumAddress: string;
  emergencyAdmin: string;
  history: [string];
  lastUpdateTimestamp: number;

  reserves: [string];
  depositHistory: [string];
  redeemUnderlyingHistory: [string];
  borrowHistory: [string];
  swapHistory: [string];
  usageAsCollateralHistory: [string];
  rebalanceStableBorrowRateHistory: [string];
  repayHistory: [string];
  flashLoanHistory: [string];
  liquidationCallHistory: [string];

  active: Boolean;
  paused: Boolean;
}

export interface PriceHistoryItem {
  id: string;
  asset: string;
  price: string;
  timestamp: string;
}

export interface UsdEthPriceHistoryItem {
  id: string;
  oracle: string;
  price: string;
  timestamp: string;
}

export interface PriceOracle {
  id: string;
  proxyPriceProvider: string;
  usdPriceEth: string;
  usdPriceEthMainSource: string;
  usdPriceEthFallbackRequired: Boolean;
  usdDependentAssets: [string];
  fallbackPriceOracle: string;
  tokens: [string];
  usdPriceEthHistory: [string];
  tokensWithFallback: [string];
  lastUpdateTimestamp: number;
  version: number;
  baseCurrency: string;
  baseCurrencyUnit: string;
}

export interface SToken {
  id: string;
  pool: string;
  underlyingAssetAddress: string;
  underlyingAssetDecimals: number;
  tokenContractImpl: string;
}

export interface VToken {
  id: string;
  pool: string;
  underlyingAssetAddress: string;
  underlyingAssetDecimals: number;
  tokenContractImpl: string;
}

export interface AToken {
  id: string;
  pool: string;
  underlyingAssetAddress: string;
  underlyingAssetDecimals: number;
  tokenContractImpl: string;
}

export interface VariableDebtToken {
  id: string;
  pool: string;
  underlyingAssetAddress: string;
  underlyingAssetDecimals: number;
}

export interface StableDebtToken {
  id: string;
  pool: string;
  underlyingAssetAddress: string;
  underlyingAssetDecimals: number;
}

export interface Referrer {
  id: string;
  deposits: [string];
  borrows: [string];
}

export interface Deposit {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  caller: string;
  reserve: string;
  userReserve: string;
  amount: string;
  referrer: string;
  timestamp: string;
  assetPriceUSD: string;
}

export interface RedeemUnderlying {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  to: string;
  reserve: string;
  userReserve: string;
  amount: string;
  timestamp: string;
  assetPriceUSD: string;
}

export interface Borrow {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  caller: string;
  reserve: string;
  userReserve: string;
  amount: string;
  borrowRate: string;
  borrowRateMode: string;
  referrer: string;
  timestamp: string;
  stableTokenDebt: string;
  variableTokenDebt: string;
  assetPriceUSD: string;
}

export interface Swap {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  reserve: string;
  userReserve: string;
  borrowRateModeFrom: string;
  borrowRateModeTo: string;
  stableBorrowRate: string;
  variableBorrowRate: string;
  timestamp: string;
}

export interface UsageAsCollateral {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  reserve: string;
  userReserve: string;
  fromState: Boolean;
  toState: Boolean;
  timestamp: string;
}

export interface RebalanceStableBorrowRate {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  reserve: string;
  userReserve: string;
  borrowRateFrom: string;
  borrowRateTo: string;
  timestamp: string;
}

export interface Repay {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  repayer: string;
  reserve: string;
  userReserve: string;
  amount: string;
  timestamp: string;
  assetPriceUSD: string;
}

export interface FlashLoan {
  id: string;
  pool: string;
  reserve: string;
  target: string;
  amount: string;
  totalFee: string;
  initiator: string;
  timestamp: string;
  assetPriceUSD: string;
}

export interface LiquidationCall {
  id: string;
  txHash: string;
  action: string;
  pool: string;
  user: string;
  collateralReserve: string;
  collateralUserReserve: string;
  collateralAmount: string;
  principalReserve: string;
  principalUserReserve: string;
  principalAmount: string;
  liquidator: string;
  timestamp: string;
  collateralAssetPriceUSD: string;
  borrowAssetPriceUSD: string;
}

export interface ReserveConfigurationHistoryItem {
  id: string;
  reserve: string;
  usageAsCollateralEnabled: Boolean;
  borrowingEnabled: Boolean;
  stableBorrowRateEnabled: Boolean;
  isActive: Boolean;
  isFrozen: Boolean;
  reserveInterestRateStrategy: string;
  baseLTVasCollateral: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  timestamp: string;
}

export interface ReserveParamsHistoryItem {
  id: string;
  reserve: string;
  variableBorrowRate: string;
  variableBorrowIndex: string;
  utilizationRate: string;
  stableBorrowRate: string;
  averageStableBorrowRate: string;
  liquidityIndex: string;
  liquidityRate: string;
  totalLiquidity: string;
  totalATokenSupply: string;
  totalLiquidityAsCollateral: string;
  availableLiquidity: string;
  priceInEth: string;
  priceInUsd: string;
  timestamp: string;
  totalScaledVariableDebt: string;
  totalCurrentVariableDebt: string;
  totalPrincipalStableDebt: string;
  lifetimePrincipalStableDebt: string;
  lifetimeScaledVariableDebt: string;
  lifetimeCurrentVariableDebt: string;
  lifetimeLiquidity: string;
  lifetimeRepayments: string;
  lifetimeWithdrawals: string;
  lifetimeBorrows: string;
  lifetimeLiquidated: string;
  lifetimeFlashLoans: string;
  lifetimeFlashLoanPremium: string;
  lifetimeReserveFactorAccrued: string;
  lifetimeDepositorsInterestEarned: string;
}

export interface IncentivesController {
  id: string;
  rewardToken: string;
  rewardTokenDecimals: number;
  rewardTokenSymbol: string;
  precision: number;
  emissionEndTimestamp: number;

  incentivizedActions: [string];
  claimIncentives: [string];
}

export interface IncentivizedAction {
  id: string;
  incentivesController: string;
  user: string;
  amount: string;
}

export interface ClaimIncentiveCall {
  id: string;
  incentivesController: string;
  user: string;
  amount: string;
}

export interface MapAssetPool {
  id: string;
  pool: string;
  underlyingAsset: string;
}

export interface Reserve {
  id: string;
  underlyingAsset: string;
  pool: string;
  symbol: string;
  name: string;
  decimals: number;
  usageAsCollateralEnabled: Boolean;
  borrowingEnabled: Boolean;
  stableBorrowRateEnabled: Boolean;
  isActive: Boolean;
  isFrozen: Boolean;
  price: string;
  reserveInterestRateStrategy: string;
  optimalUtilisationRate: string;
  variableRateSlope1: string;
  variableRateSlope2: string;
  stableRateSlope1: string;
  stableRateSlope2: string;
  baseVariableBorrowRate: string;
  baseLTVasCollateral: string;
  reserveLiquidationThreshold: string;
  reserveLiquidationBonus: string;
  utilizationRate: string;
  totalLiquidity: string;
  totalATokenSupply: string;
  totalLiquidityAsCollateral: string;
  availableLiquidity: string;
  totalPrincipalStableDebt: string;
  totalScaledVariableDebt: string;
  totalCurrentVariableDebt: string;
  totalDeposits: string;
  liquidityRate: string;
  averageStableRate: string;
  variableBorrowRate: string;
  stableBorrowRate: string;
  liquidityIndex: string;
  variableBorrowIndex: string;
  aToken: string;
  vToken: string;
  sToken: string;
  reserveFactor: string;
  lastUpdateTimestamp: number;
  stableDebtLastUpdateTimestamp: number;

  aEmissionPerSecond: string;
  vEmissionPerSecond: string;
  sEmissionPerSecond: string;
  aTokenIncentivesIndex: string;
  vTokenIncentivesIndex: string;
  sTokenIncentivesIndex: string;
  aIncentivesLastUpdateTimestamp: number;
  vIncentivesLastUpdateTimestamp: number;
  sIncentivesLastUpdateTimestamp: number;

  lifetimeLiquidity: string;
  lifetimePrincipalStableDebt: string;
  lifetimeScaledVariableDebt: string;
  lifetimeCurrentVariableDebt: string;
  lifetimeRepayments: string;
  lifetimeWithdrawals: string;
  lifetimeBorrows: string;
  lifetimeLiquidated: string;
  lifetimeFlashLoans: string;
  lifetimeFlashLoanPremium: string;
  lifetimeDepositorsInterestEarned: string;
  lifetimeReserveFactorAccrued: string;
  userReserves: [string];
  depositHistory: [string];
  redeemUnderlyingHistory: [string];
  borrowHistory: [string];
  usageAsCollateralHistory: [string];
  swapHistory: [string];
  rebalanceStableBorrowRateHistory: [string];
  repayHistory: [string];
  flashLoanHistory: [string];
  liquidationCallHistory: [string];
  paramsHistory: [string];
  configurationHistory: [string];
  deposits: [string];
}

export interface WETHReserve {
  id: string;
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  updatedTimestamp: number;
  updatedBlockNumber: string;
}

export interface ATokenBalanceHistoryItem {
  id: string;
  userReserve: string;
  timestamp: string;
  scaledATokenBalance: string;
  currentATokenBalance: string;
  index: string;
}

export interface VTokenBalanceHistoryItem {
  id: string;
  userReserve: string;
  scaledVariableDebt: string;
  currentVariableDebt: string;
  timestamp: string;
  index: string;
}

export interface STokenBalanceHistoryItem {
  id: string;
  userReserve: string;
  principalStableDebt: string;
  currentStableDebt: string;
  timestamp: string;
  avgStableBorrowRate: string;
}

export interface StableTokenDelegatedAllowance {
  id: string;
  fromUser: string;
  toUser: string;
  amountAllowed: string;
  userReserve: string;
}

export interface VariableTokenDelegatedAllowance {
  id: string;
  fromUser: string;
  toUser: string;
  amountAllowed: string;
  userReserve: string;
}

export interface UserReserve {
  id: string;
  pool: string;
  reserve: string;
  user: string;
  usageAsCollateralEnabledOnUser: Boolean;
  scaledATokenBalance: string;
  currentATokenBalance: string;
  scaledVariableDebt: string;
  currentVariableDebt: string;
  principalStableDebt: string;
  currentStableDebt: string;
  currentTotalDebt: string;
  stableBorrowRate: string;
  oldStableBorrowRate: string;
  liquidityRate: string;
  stableBorrowLastUpdateTimestamp: number;
  variableBorrowIndex: string;

  aTokenincentivesUserIndex: string;
  vTokenincentivesUserIndex: string;
  sTokenincentivesUserIndex: string;
  aIncentivesLastUpdateTimestamp: number;
  vIncentivesLastUpdateTimestamp: number;
  sIncentivesLastUpdateTimestamp: number;
  lastUpdateTimestamp: number;
  stableTokenDelegatedAllowances: [string];
  variableTokenDelegatedAllowances: [string];
  aTokenBalanceHistory: [string];
  vTokenBalanceHistory: [string];
  sTokenBalanceHistory: [string];

  usageAsCollateralHistory: [string];
  depositHistory: [string];
  redeemUnderlyingHistory: [string];
  borrowHistory: [string];
  swapHistory: [string];
  rebalanceStableBorrowRateHistory: [string];
  repayHistory: [string];
  liquidationCallHistory: [string];
}

export interface User {
  id: string;
  borrowedReservesCount: number;

  unclaimedRewards: string;
  lifetimeRewards: string;
  incentivesLastUpdated: number;

  reserves: [string];
  depositHistory: [string];
  redeemUnderlyingHistory: [string];
  usageAsCollateralHistory: [string];
  borrowHistory: [string];
  swapHistory: [string];
  rebalanceStableBorrowRateHistory: [string];
  repayHistory: [string];
  liquidationCallHistory: [string];
  incentivizedActions: [string];
  claimIncentives: [string];
}

export interface SwapHistory {
  id: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  receivedAmount: string;
  swapType: string;
}
