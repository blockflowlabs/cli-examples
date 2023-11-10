/**
 * @dev Event::PairCreated(address token0, address token1, address pair, uint256 )
 * @param instance database [key, value]
 * @param event trigger object with keys [token0 ,token1 ,pair , ]
 */
export const PairCreatedHandler = (db: any, event: any, block: any) => {
  // To init a variable in database instance
  if (!db["factory"]) db["factory"] = {};
  if (!db["pairs"]) db["pairs"] = {};
  if (!db["tokens"]) db["tokens"] = {};

  if (!db["factory"]["pairCount"]) db["factory"]["pairCount"] = 0;
  if (!db["factory"]["totalVolumeUSD"]) db["factory"]["totalVolumeUSD"] = 0;
  if (!db["factory"]["totalVolumeETH"]) db["factory"]["totalVolumeETH"] = 0;
  if (!db["factory"]["totalLiquidityUSD"])
    db["factory"]["totalLiquidityUSD"] = 0;
  if (!db["factory"]["totalLiquidityETH"])
    db["factory"]["totalLiquidityETH"] = 0;

  // To get variable in database instance
  let factory = db["factory"];
  let pairs = db["pairs"];
  let tokens = db["tokens"];
  let pair = event["pair"];
  let token0 = event["token0"];
  let token1 = event["token1"];
  let pairCount = factory["pairCount"] || 0;

  // Implement your event handler logic for PairCreated here
  factory["pairCount"] = pairCount + 1;
  factory["totalVolumeUSD"] = factory["totalVolumeUSD"] + 0;
  factory["totalVolumeETH"] = factory["totalVolumeETH"] + 0;
  factory["totalLiquidityUSD"] = factory["totalLiquidityUSD"] + 0;
  factory["totalLiquidityETH"] = factory["totalLiquidityETH"] + 0;

  pairs[pair] = {
    id: pair,
    token0: token0,
    token1: token1,
    reserve0: 0,
    reserve1: 0,
    totalSupply: 0,
    reserveETH: 0,
    reserveUSD: 0,
    trackedReserveETH: 0,
    token0Price: 0,
    token1Price: 0,
    volumeToken0: 0,
    volumeToken1: 0,
    volumeUSD: 0,
    txCount: 0,
    createdAtBlockNumber: block.timestamp,
  };

  // If token0 is not in database, init it
  if (!tokens[token0]) {
    tokens[token0] = {
      id: token0,
      symbol: "",
      name: "",
      decimals: 0,
      tradeVolume: 0,
      tradeVolumeUSD: 0,
      txCount: 0,
      totalLiquidity: 0,
      derivedETH: 0,
      createdAtBlockNumber: block.timestamp,
    };
  }
  // If token1 is not in database, init it
  if (!tokens[token1]) {
    tokens[token1] = {
      id: token1,
      symbol: "",
      name: "",
      decimals: 0,
      tradeVolume: 0,
      tradeVolumeUSD: 0,
      txCount: 0,
      totalLiquidity: 0,
      derivedETH: 0,
      createdAtBlockNumber: block.timestamp,
    };
  }

  // To update a variable in database instance
  db["factory"] = factory;
  db["pairs"] = pairs;
  db["tokens"] = tokens;
};
