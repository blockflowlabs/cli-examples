import { BigNumber } from "bignumber.js";

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
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Burn here
};

/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0 ,amount1 ]
 */
export const MintHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Mint here
};

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param instance database [key, value]
 * @param event trigger object with keys [sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to ]
 */
export const SwapHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Swap here
};

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param instance database [key, value]
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
