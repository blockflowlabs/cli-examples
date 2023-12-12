import { BigNumber } from "bignumber.js";

const tokenToAddr: any = {
  "WETH": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  "DAI": "0x6b175474e89094c44da98b954eedeac495271d0f",
  "USDT": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "USDC": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
}

const pairToTokens: any = {
  "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11": ['DAI', 'WETH'],
  "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc": ['USDC', 'WETH'],
  "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852": ['WETH', 'USDT']
}

/**
 * @dev Event::Burn(address sender, uint256 amount0, uint256 amount1, address to)
 * @param db database [key, value]
 * @param context trigger object contains [event: [sender ,amount0 ,amount1 ,to ], log, transaction, block]
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
    block: context.block.block_number,
    transaction: context.transaction.transaction_hash,
    sender: context.event.sender,
    pair,
    token0,
    token1,
    amount0,
    amount1,
    to: context.event.to
  });

  // To update a variable in database instance
  db["transactions"] = transactions;
};

/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param db database [key, value]
 * @param context trigger object contains [event: [sender ,amount0 ,amount1], log, transaction, block]
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
    block: context.block.block_number,
    transaction: context.transaction.transaction_hash,
    sender: context.event.sender,
    pair,
    token0,
    token1,
    amount0,
    amount1,
  });

  // To update a variable in database instance
  db["transactions"] = transactions;
};

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param db database [key, value]
 * @param context trigger object contains [event: [sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to ], log, transaction, block]
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
  let amount0In = context.event["amount0In"];
  let amount1In = context.event["amount1In"];
  let amount0Out = context.event["amount0Out"];
  let amount1Out = context.event["amount1Out"];

  // Implement your event handler logic for Swap here
  db["transactions"]["swaps"].push({
    timestamp: context.block.timestamp,
    block: context.block.block_number,
    transaction: context.transaction.transaction_hash,
    sender: context.event.sender,
    pair,
    token0,
    token1,
    amount0In,
    amount1In,
    amount0Out,
    amount1Out,
    to: context.event.to
  });

  if (!db["pairs"][pair])
    db["pairs"][pair] = {
      id: pair,
      token0: token0,
      token1: token1,
      reserve0: BigNumber(0).toString(),
      reserve1: BigNumber(0).toString(),
      // totalSupply: BigNumber(0).toString(),
      volumeToken0: BigNumber(0).toString(),
      volumeToken1: BigNumber(0).toString(),
      txnCount: BigNumber(0).toString(),
    };
  
  const token0Volume = new BigNumber(amount0Out).minus(amount0In).abs();
  const token1Volume = new BigNumber(amount1Out).minus(amount1In).abs();
  
  db['pairs'][pair].volumeToken0 = new BigNumber(db['pairs'][pair].volumeToken0).plus(token0Volume).toString();
  db['pairs'][pair].volumeToken1 = new BigNumber(db['pairs'][pair].volumeToken1).plus(token1Volume).toString();
  db['pairs'][pair].txCount = new BigNumber(db['pairs'][pair].txnCount).plus(1).toString();
};

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param db database [key, value]
 * @param context trigger object contains [event: [reserve0 ,reserve1 ], log, transaction, block]
 */
export const SyncHandler = (db: any, context: any) => {
  // To init a variable in database instance
  let pair = context.log.log_address;
  let token0 = tokenToAddr[pairToTokens[pair][0]];
  let token1 = tokenToAddr[pairToTokens[pair][1]];

  if (!db["pairs"]) db["pairs"] = {};
  if (!db["tokens"]) db["tokens"] = {};

  if (!db["pairs"][pair])
    db["pairs"][pair] = {
      id: pair,
      token0: token0,
      token1: token1,
      reserve0: BigNumber(0).toString(),
      reserve1: BigNumber(0).toString(),
      // totalSupply: BigNumber(0).toString(),
      volumeToken0: BigNumber(0).toString(),
      volumeToken1: BigNumber(0).toString(),
      txCount: BigNumber(0).toString(),
    };

  // Implement your event handler logic for Sync here
  db['pairs'][pair]["reserve0"] = context.event.reserve0
  db['pairs'][pair]["reserve1"] = context.event.reserve1;
};

// /**
//  * @dev Event::Transfer(address from, address to, uint256 value)
//  * @param instance database [key, value]
//  * @param event trigger object with keys [from ,to ,value ]
//  */
// export const TransferHandler = (db: any, event: any) => {
//   // To init a variable in database instance
//   // if(!db['from']) db['from'] = {}
//   // To get variable in database instance
//   // let from = db['from']
//   // To update a variable in database instance
//   // db['from'] = event.from || event.arg0 || event['0']
//   // Implement your event handler logic for Transfer here
// };
