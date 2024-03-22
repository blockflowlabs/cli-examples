import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";

import {
  getEthPriceInUSD,
  getTrackedLiquidityUSD,
  findEthPerToken,
} from "../price";
import { ZERO_BI, FACTORY_ADDRESS, convertTokenToDecimal } from "../helper";
import {
  Pair,
  Bundle,
  Token,
  UniswapFactory,
  TokenToPair,
} from "../../types/schema";
import { IPair, IToken, IBundle, IUniswapFactory } from "../../types/schema";

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param context trigger object with contains {event: {reserve0 ,reserve1 }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const SyncHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
) => {
  // Implement your event handler logic for Sync here
  const { event, log } = context;
  let { reserve0, reserve1 } = event;

  reserve0 = reserve0.toString();
  reserve1 = reserve1.toString();

  const tokenDB = bind(Token);
  const pairDB: Instance = bind(Pair);
  const factoryDB: Instance = bind(UniswapFactory);

  let pair: IPair = await pairDB.findOne({ id: log.log_address.toLowerCase() });
  let token0: IToken = await tokenDB.findOne({ id: pair.token0.toLowerCase() });
  let token1: IToken = await tokenDB.findOne({ id: pair.token1.toLowerCase() });
  // prettier-ignore
  let uniswap: IUniswapFactory = await factoryDB.findOne({ id: FACTORY_ADDRESS.toLowerCase()});

  // reset factory liquidity by subtracting onluy tarcked liquidity
  uniswap.totalLiquidityETH = new BigNumber(uniswap.totalLiquidityETH)
    .minus(pair.trackedReserveETH)
    .toString();

  // reset token total liquidity amounts
  token0.totalLiquidity = new BigNumber(token0.totalLiquidity)
    .minus(pair.reserve0)
    .toString();
  token1.totalLiquidity = new BigNumber(token1.totalLiquidity)
    .minus(pair.reserve1)
    .toString();

  pair.reserve0 = convertTokenToDecimal(reserve0, parseInt(token0.decimals));
  pair.reserve1 = convertTokenToDecimal(reserve1, parseInt(token1.decimals));

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
  await bundleDB.save(bundle);

  // prettier-ignore
  token0.derivedETH = await findEthPerToken(token0.id, pairDB, bind(TokenToPair), tokenDB);
  // prettier-ignore
  token1.derivedETH = await findEthPerToken(token1.id, pairDB, bind(TokenToPair), tokenDB);

  // get tracked liquidity - will be 0 if neither is in whitelist
  let trackedLiquidityETH: string;
  if (!new BigNumber(bundle.ethPrice).eq(ZERO_BI)) {
    // prettier-ignore
    trackedLiquidityETH = new BigNumber(getTrackedLiquidityUSD(pair.reserve0, token0, pair.reserve1, token1, bundle.ethPrice))
      .div(bundle.ethPrice)
      .toString();
  } else trackedLiquidityETH = ZERO_BI.toString();

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
  await pairDB.save(pair);
  await factoryDB.save(uniswap);
  await tokenDB.save(token0);
  await tokenDB.save(token1);
};
