import { String, Array, Number } from "@blockflow-labs/utils";

interface User {
  id: String;
  liquidityPositions: [String];
  usdSwapped: String;
}

interface TokenToPair {
  id: string;
  pair: string;
}

interface UniswapFactory {
  id: String;
  pairCount: String;
  totalVolumeUSD: String;
  totalVolumeETH: String;
  untrackedVolumeUSD: String;
  totalLiquidityUSD: String;
  totalLiquidityETH: String;
  txCount: String;
}

interface Token {
  id: String;
  symbol: String;
  name: String;
  decimals: String;
  totalSupply: String;
  tradeVolume: String;
  tradeVolumeUSD: String;
  untrackedVolumeUSD: String;
  txCount: String;
  totalLiquidity: String;
  derivedETH: String;
  tokenDayData: [String];
  pairDayDataBase: [String];
  pairDayDataQuote: [String];
  pairBase: [String];
  pairQuote: [String];
}

interface Pair {
  id: String;

  token0: String;
  token1: String;
  reserve0: String;
  reserve1: String;
  totalSupply: String;

  reserveETH: String;
  reserveUSD: String;
  trackedReserveETH: String;

  token0Price: String;
  token1Price: String;

  volumeToken0: String;
  volumeToken1: String;
  volumeUSD: String;
  untrackedVolumeUSD: String;
  txCount: String;

  createdAtTimestamp: String;
  createdAtBlockNumber: Number;

  liquidityProviderCount: String;
  pairHourData: [String];
  liquidityPositions: [String];
  liquidityPositionSnapshots: [String];
  mints: [String];
  burns: [String];
  swaps: [String];
}

interface Bundle {
  id: String;
  ethPrice: String;
}

interface Transaction {
  id: String;
  timestamp: String;
  mints: [String];
  burns: [String];
  swaps: [String];
}

interface Mint {
  id: String;
  transaction: String;
  timestamp: String;
  pair: String;
  to: String;
  liquidity: String;
  sender: String;
  amount0: String;
  amount1: String;
  logIndex: String;
  amountUSD: String;
  feeTo: String;
  feeLiquidity: String;
}

interface LiquidityPosition {
  id: String;
  user: String;
  pair: String;
  liquidityTokenBalance: String;
}

interface LiquidityPositionSnapshot {
  id: String;
  liquidityPosition: String;
  timestamp: String;
  user: String;
  pair: String;
  token0PriceUSD: String;
  token1PriceUSD: String;
  reserve0: String;
  reserve1: String;
  reserveUSD: String;
  liquidityTokenTotalSupply: String;
  liquidityTokenBalance: String;
}

interface PairDayData {
  id: String;
  date: String;
  pairAddress: String;
  token0: String;
  token1: String;

  reserve0: String;
  reserve1: String;

  totalSupply: String;

  reserveUSD: String;

  dailyVolumeToken0: String;
  dailyVolumeToken1: String;
  dailyVolumeUSD: String;
  dailyTxns: String;
}

interface PairHourData {
  id: String;
  hourStartUnix: String;
  pair: String;

  reserve0: String;
  reserve1: String;

  totalSupply: String;

  reserveUSD: String;

  hourlyVolumeToken0: String;
  hourlyVolumeToken1: String;
  hourlyVolumeUSD: String;
  hourlyTxns: String;
}

interface UniswapDayData {
  id: String;
  date: String;

  dailyVolumeETH: String;
  dailyVolumeUSD: String;
  dailyVolumeUntracked: String;

  totalVolumeETH: String;
  totalLiquidityETH: String;
  totalVolumeUSD: String;
  totalLiquidityUSD: String;

  txCount: String;
}

interface TokenDayData {
  id: String;
  date: String;
  token: String;

  dailyVolumeToken: String;
  dailyVolumeETH: String;
  dailyVolumeUSD: String;
  dailyTxns: String;

  totalLiquidityToken: String;
  totalLiquidityETH: String;
  totalLiquidityUSD: String;

  priceUSD: String;
}

interface Swap {
  id: String;
  transaction: String;
  timestamp: String;
  pair: String;

  sender: String;
  from: String;
  amount0In: String;
  amount1In: String;
  amount0Out: String;
  amount1Out: String;
  to: String;
  logIndex: String;

  amountUSD: String;
}

interface Burn {
  id: String;
  transaction: String;
  timestamp: String;
  pair: String;

  liquidity: String;

  sender: String;
  amount0: String;
  amount1: String;
  to: String;
  logIndex: String;
  amountUSD: String;

  needsComplete: Boolean;

  feeTo: String;
  feeLiquidity: String;
}
