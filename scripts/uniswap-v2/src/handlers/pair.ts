import { BigNumber } from "bignumber.js";

const tokenToAddr = {
  "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
  "USDT": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "USDC": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
}

const pairToTokens = {
  "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11": ['DAI', 'WETH'],
  "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc": ['USDC', 'WETH'],
  "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852": ['WETH', 'USDT']
}

/**
 * @dev Event::Burn(address sender, uint256 amount0, uint256 amount1, address to)
 * @param db database [key, value]
 * @param context trigger object with contains [event: [sender ,amount0 ,amount1 ,to ], log, transaction, block]
 */
export const BurnHandler = (db: any, context: any) => {
  let pair = context.log.log_address;
  let token0 = tokenToAddr[pairToTokens[pair][0]];
  let token1 = tokenToAddr[pairToTokens[pair][1]];

  // To init a variable in database instance
  if (!db["pairs"]) db["pairs"] = {};
  if (!db["tokens"]) db["tokens"] = {};
  if (!db["transactions"]) db["transactions"] = {};
  if (!db["transactions"]["burns"]) db["transactions"]["burns"] = [];

  // To get variable in database instance
  let transactions = db["transactions"];
  let amount0 = context.event["amount0"];
  let amount1 = context.event["amount1"];

  // Implement your event handler logic for Burn here
  transactions["burns"].push({
    timestamp: context.block.timestamp,
    pair,
    token0,
    token1,
    amount0,
    amount1,
  });

  //TODO: update token0 and token1 tradeVolume, tradeVolumeUSD, txCount, reserve0, reserve1, totalLiquidity, derivedETH

  // To update a variable in database instance
  db["transactions"] = transactions;
};

/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param db database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ]
 */
export const MintHandler = (db: any, context: any) => {
  let pair = context.log.log_address;
  let token0 = tokenToAddr[pairToTokens[pair][0]];
  let token1 = tokenToAddr[pairToTokens[pair][1]];

  // To init a variable in database instance
  if (!db["pairs"]) db["pairs"] = {};
  if (!db["tokens"]) db["tokens"] = {};
  if (!db["transactions"]) db["transactions"] = {};
  if (!db["transactions"]["mints"]) db["transactions"]["mints"] = [];

  // To get variable in database instance
  let transactions = db["transactions"];
  let amount0 = context.event["amount0"];
  let amount1 = context.event["amount1"];

  // Implement your event handler logic for Mint here
  transactions["mints"].push({
    timestamp: context.block.timestamp,
    pair,
    token0,
    token1,
    amount0,
    amount1,
  });

  //TODO: update token0 and token1 tradeVolume, tradeVolumeUSD, txCount, reserve0, reserve1, totalLiquidity, derivedETH

  // To update a variable in database instance
  db["transactions"] = transactions;
};

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param db database [key, value]
 * @param event trigger object with keys [sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to ]
 */
export const SwapHandler = (db: any, context: any) => {
  let pair = context.log.log_address;
  let token0 = tokenToAddr[pairToTokens[pair][0]];
  let token1 = tokenToAddr[pairToTokens[pair][1]];

  // To init a variable in database instance
  if (!db["pairs"]) db["pairs"] = {};
  if (!db["tokens"]) db["tokens"] = {};
  if (!db["transactions"]) db["transactions"] = {};
  if (!db["transactions"]["swaps"]) db["transactions"]["swaps"] = [];

  // To get variable in database instance
  let transactions = db["transactions"];
  let amount0In = context.event["amount0In"];
  let amount1In = context.event["amount1In"];
  let amount0Out = context.event["amount0Out"];
  let amount1Out = context.event["amount1Out"];

  // Implement your event handler logic for Swap here
  transactions["swaps"].push({
    timestamp: context.block.timestamp,
    pair,
    token0,
    token1,
    amount0In,
    amount1In,
    amount0Out,
    amount1Out,
  });

  //TODO: update token0 and token1 tradeVolume, tradeVolumeUSD, txCount, reserve0, reserve1, totalLiquidity, derivedETH

  // To update a variable in database instance
  db["transactions"] = transactions;
};

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param db database [key, value]
 * @param event trigger object with keys [reserve0 ,reserve1 ]
 */
export const SyncHandler = (db: any, event: any, block: any) => {
  // To init a variable in database instance
  let daiEthPair = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11";
  let daiAddress = "0x6b175474e89094c44da98b954eedeac495271d0f";
  let ethAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  if (!db["pairs"]) db["pairs"] = {};
  if (!db["tokens"]) db["tokens"] = {};

  if (!db["pairs"][daiEthPair])
    db["pairs"][daiEthPair] = {
      id: daiEthPair,
      token0: daiAddress,
      token1: ethAddress,
      reserve0: BigNumber(0).toString(),
      reserve1: BigNumber(0).toString(),
      totalSupply: BigNumber(0).toString(),
      reserveETH: BigNumber(0).toString(),
      reserveUSD: BigNumber(0).toString(),
      trackedReserveETH: BigNumber(0).toString(),
      token0Price: BigNumber(0).toString(),
      token1Price: BigNumber(0).toString(),
      volumeToken0: BigNumber(0).toString(),
      volumeToken1: BigNumber(0).toString(),
      volumeUSD: BigNumber(0).toString(),
      txCount: BigNumber(0).toString(),
      createdAtBlockNumber: block.timestamp,
    };

  if (!db["tokens"][daiAddress])
    db["tokens"][daiAddress] = {
      id: daiAddress,
      symbol: "DAI",
      name: "Dai Stablecoin",
      decimals: 18,
      tradeVolume: BigNumber(0),
      tradeVolumeUSD: BigNumber(0),
      txCount: BigNumber(0),
      totalLiquidity: BigNumber(0),
      derivedETH: BigNumber(0),
    };

  if (!db["tokens"][ethAddress])
    db["tokens"][ethAddress] = {
      id: ethAddress,
      symbol: "ETH",
      name: "Ether",
      decimals: 18,
      tradeVolume: BigNumber(0),
      tradeVolumeUSD: BigNumber(0),
      txCount: BigNumber(0),
      totalLiquidity: BigNumber(0),
      derivedETH: BigNumber(1),
    };

  // To get variable in database instance
  let pairs = db["pairs"];
  let tokens = db["tokens"];
  let pair = pairs[daiEthPair];
  let token0 = tokens[daiAddress];
  let token1 = tokens[ethAddress];
  let reserve0 = event["reserve0"];
  let reserve1 = event["reserve1"];
  let decimals0 = token0["decimals"] || 18;
  let decimals1 = token1["decimals"] || 18;

  // Implement your event handler logic for Sync here
  pair["reserve0"] = BigNumber(reserve0).dividedBy(
    BigNumber(10).pow(decimals0)
  );
  pair["reserve1"] = BigNumber(reserve1).dividedBy(
    BigNumber(10).pow(decimals1)
  );

  pairs[daiEthPair] = pair;
  tokens[daiAddress] = token0;
  tokens[ethAddress] = token1;

  // To update a variable in database instance
  db["pairs"] = pairs;
  db["tokens"] = tokens;
};

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param instance database [key, value]
 * @param event trigger object with keys [from ,to ,value ]
 */
export const TransferHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Transfer here
};
