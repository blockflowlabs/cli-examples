import { String, Array, Number } from "@blockflow-labs/utils";

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
  // symbol: String;
  // name: String;
  // decimals: String;
  // totalSupply: String;
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
