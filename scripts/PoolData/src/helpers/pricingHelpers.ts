const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const DAI_ADDRESS = "0x6b175474e89094c44da98b954eedeac495271d0f";
const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

const DAI_ETH_PAIR = "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"; // token0: DAI, token1: WETH
const USDC_ETH_PAIR = "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"; // token0: USDC, token1: WETH
const USDT_ETH_PAIR = "0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852"; // token0: WETH, token1: USDT

const WHITELIST_PAIRS = [DAI_ETH_PAIR, USDC_ETH_PAIR, USDT_ETH_PAIR];

function reserve0(pairAddress: string, db: any) {
  return db.get(pairAddress).reserve0;
}

function reserve1(pairAddress: string, db: any) {
  return db.get(pairAddress).reserve1;
}

function token0Price(pairAddress: string, db: any) {
  return db.get(pairAddress).token0Price;
}

function token1Price(pairAddress: string, db: any) {
  return db.get(pairAddress).token1Price;
}

function token0DerivedETH(pairAddress: string, db: any) {
  return db.get(pairAddress).token0.derivedETH;
}

function token1DerivedETH(pairAddress: string, db: any) {
  return db.get(pairAddress).token1.derivedETH;
}

export function getEthPriceInUSD(db: any) {
  let totalEthLiquidity =
    reserve1(DAI_ETH_PAIR, db) +
    reserve1(USDC_ETH_PAIR, db) +
    reserve0(USDT_ETH_PAIR, db);
  let daiWeight = reserve1(DAI_ETH_PAIR, db) / totalEthLiquidity;
  let usdcWeight = reserve1(USDC_ETH_PAIR, db) / totalEthLiquidity;
  let usdtWeight = reserve0(USDT_ETH_PAIR, db) / totalEthLiquidity;

  let ethPriceInUSD =
    daiWeight * token0Price(DAI_ETH_PAIR, db) +
    usdcWeight * token0Price(USDC_ETH_PAIR, db) +
    usdtWeight * token1Price(USDT_ETH_PAIR, db);

  return ethPriceInUSD;
}

export function findETHPerToken(tokenAddress: string, db: any) {
  if (tokenAddress == WETH_ADDRESS) {
    return 1;
  }
  if (tokenAddress == DAI_ADDRESS) {
    return token1Price(DAI_ETH_PAIR, db).times(
      token0DerivedETH(DAI_ETH_PAIR, db)
    );
  }
  if (tokenAddress == USDC_ADDRESS) {
    return token1Price(USDC_ETH_PAIR, db).times(
      token0DerivedETH(USDC_ETH_PAIR, db)
    );
  }
  if (tokenAddress == USDT_ADDRESS) {
    return token0Price(USDT_ETH_PAIR, db).times(
      token1DerivedETH(USDT_ETH_PAIR, db)
    );
  }
}

export function getTrackedLiquidity(
  token0: any,
  token1: any,
  token0Amount: any,
  token1Amount: any,
  db: any
) {
  let token0PriceInETH = findETHPerToken(token0.address, db);
  let token1PriceInETH = findETHPerToken(token1.address, db);

  let token0Liquidity = token0Amount.times(token0PriceInETH);
  let token1Liquidity = token1Amount.times(token1PriceInETH);

  return token0Liquidity.plus(token1Liquidity);
}
