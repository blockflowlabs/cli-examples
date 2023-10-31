/**
 * @dev Event::Approval(address owner, address spender, uint256 value)
 * @param instance database [key, value]
 * @param event trigger object with keys [owner ,spender ,value ]
 */
export const ApprovalHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Approval here
};

/**
 * @dev Event::Burn(address sender, uint256 amount0, uint256 amount1, address to)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ,to ]
 */
export const BurnHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["burns"]) db["burns"] = [];

  // To get variable in database instance
  let burns = db["burns"];

  // Implement your event handler logic for Burn here
  burns.push({
    pair: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
    token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token0Symbol: "USDC",
    token1Symbol: "WETH",
    amount0: event.amount0,
    amount1: event.amount1,
  });

  // To update a variable in database instance
  db["burns"] = burns;
};

/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ]
 */
export const MintHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["mints"]) db["mints"] = [];

  // To get variable in database instance
  let mints = db["mints"];

  // Implement your event handler logic for Mint here
  mints.push({
    pair: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
    token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token0Symbol: "USDC",
    token1Symbol: "WETH",
    amount0: event.amount0,
    amount1: event.amount1,
  });

  // To update a variable in database instance
  db["mints"] = mints;
};

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to ]
 */
export const SwapHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["swaps"]) db["swaps"] = [];

  // To get variable in database instance
  let swaps = db["swaps"];

  // Implement your event handler logic for Swap here
  swaps.push({
    pair: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc",
    token0: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    token1: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    token0Symbol: "USDC",
    token1Symbol: "WETH",
    amount0In: event.amount0In,
    amount1In: event.amount1In,
    amount0Out: event.amount0Out,
    amount1Out: event.amount1Out,
  });

  // To update a variable in database instance
  db["swaps"] = swaps;
};

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param instance database [key, value]
 * @param event trigger object with keys [reserve0 ,reserve1 ]
 */
export const SyncHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Sync here
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
