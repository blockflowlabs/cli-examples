import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";

import {
  ZERO_BI,
  FACTORY_ADDRESS,
  createLiquidityPosition,
  createLiquiditySnapshot,
  convertTokenToDecimal,
} from "../helper";

import { getEthPriceInUSD, getTrackedLiquidityUSD } from "../price";

import {
  updatePairDayData,
  updatePairHourData,
  updateTokenDayData,
  updateUniswapDayData,
} from "../dayUpdates";

import {
  Pair,
  Mint,
  Bundle,
  Token,
  Transaction,
  PairDayData,
  TokenDayData,
  PairHourData,
  UniswapFactory,
  UniswapDayData,
  LiquidityPosition,
} from "../../types/schema";

import {
  IMint,
  IPair,
  IToken,
  IBundle,
  ITransaction,
  IUniswapFactory,
} from "../../types/schema";

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param context trigger object with contains {event: {reserve0 ,reserve1 }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const SyncHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Sync here

  const { event, transaction, block, log } = context;
  let { reserve0, reserve1 } = event;

  reserve0 = reserve0.toString();
  reserve1 = reserve1.toString();

  // update pair database
  const pairDB: Instance = bind(Pair);
  let pair: IPair = await pairDB.findOne({ id: log.log_address.toLowerCase() });

  // update tokens database
  const tokenDB = bind(Token);
  let token0: IToken = await tokenDB.findOne({ id: pair.token0.toLowerCase() });
  let token1: IToken = await tokenDB.findOne({ id: pair.token1.toLowerCase() });

  // reset token total liquidity amounts
  token0.totalLiquidity = new BigNumber(token0.totalLiquidity)
    .minus(pair.reserve0)
    .toString();
  token1.totalLiquidity = new BigNumber(token1.totalLiquidity)
    .minus(pair.reserve1)
    .toString();

  // update factory database
  const factoryDB: Instance = bind(UniswapFactory);
  // prettier-ignore
  let uniswap: IUniswapFactory = await factoryDB.findOne({ id: FACTORY_ADDRESS.toLowerCase()});

  // reset factory liquidity by subtracting onluy tarcked liquidity
  uniswap.totalLiquidityETH = new BigNumber(uniswap.totalLiquidityETH)
    .minus(pair.trackedReserveETH)
    .toString();

  pair.reserve0 = convertTokenToDecimal(reserve0, 18);
  pair.reserve1 = convertTokenToDecimal(reserve1, 18);

  if (!new BigNumber(pair.reserve1).isEqualTo(ZERO_BI))
    pair.token0Price = new BigNumber(pair.reserve0)
      .div(pair.reserve1)
      .toString();
  else pair.token0Price = ZERO_BI.toString();
  if (!new BigNumber(pair.reserve0).isEqualTo(ZERO_BI))
    pair.token1Price = new BigNumber(pair.reserve1)
      .div(pair.reserve0)
      .toString();
  else pair.token1Price = ZERO_BI.toString();

  const bundleDB: Instance = bind(Bundle);
  const bundle: IBundle = await bundleDB.findOne({ id: "1" });
  bundle.ethPrice = await getEthPriceInUSD(pairDB);
  await bundleDB.updateOne({ id: "1" }, bundle);

  // get tracked liquidity - will be 0 if neither is in whitelist
  let trackedLiquidityETH: string;
  if (!new BigNumber(bundle.ethPrice).eq(ZERO_BI)) {
    trackedLiquidityETH = new BigNumber(
      getTrackedLiquidityUSD(
        pair.reserve0,
        token0,
        pair.reserve1,
        token1,
        bundle.ethPrice
      )
    )
      .div(bundle.ethPrice)
      .toString();
  } else {
    trackedLiquidityETH = ZERO_BI.toString();
  }

  // use derived amounts within pair
  pair.trackedReserveETH = trackedLiquidityETH;
  pair.reserveETH = new BigNumber(pair.reserve0)
    .times(token0.derivedETH)
    .plus(new BigNumber(pair.reserve1).times(token1.derivedETH))
    .toString();
  pair.reserveUSD = new BigNumber(pair.reserveETH)
    .times(bundle.ethPrice)
    .toString();

  // use tracked amounts globally
  uniswap.totalLiquidityETH = new BigNumber(uniswap.totalLiquidityETH)
    .plus(trackedLiquidityETH)
    .toString();
  uniswap.totalLiquidityUSD = new BigNumber(uniswap.totalLiquidityETH)
    .times(bundle.ethPrice)
    .toString();

  // now correctly set liquidity amounts for each token
  token0.totalLiquidity = new BigNumber(token0.totalLiquidity)
    .plus(pair.reserve0)
    .toString();
  token1.totalLiquidity = new BigNumber(token1.totalLiquidity)
    .plus(pair.reserve1)
    .toString();

  // save entities
  await pairDB.updateOne({ id: pair.id }, pair);
  await factoryDB.updateOne({ id: FACTORY_ADDRESS.toLowerCase() }, uniswap);
  await tokenDB.updateOne({ id: pair.token0.toLowerCase() }, token0);
  await tokenDB.updateOne({ id: pair.token1.toLowerCase() }, token1);
};
