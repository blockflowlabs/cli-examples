import { BigNumber } from "bignumber.js";
import { IBind, IEventContext, Instance } from "@blockflow-labs/utils";

import {
  Bundle,
  IBundle,
  IToken,
  Token,
  Pair,
  IPair,
  ILiquidityPosition,
  LiquidityPositionSnapshot,
  IPairDayData,
  IPairHourData,
  IUniswapFactory,
  ITokenDayData,
} from "../types/schema";

import { FACTORY_ADDRESS, ZERO_BI, ONE_BI } from "./helper";

export async function updatePairDayData(
  context: IEventContext,
  pairDayDataDB: Instance,
  pairDB: Instance
) {
  const timestamp = context.block.block_timestamp;
  const dayID = Math.floor(parseInt(timestamp) / 86400);
  const dayStartTimestamp = dayID * 86400;
  const dayPairID = `${context.log.log_address.toLowerCase()}-${dayID}`;

  const pair: IPair = await pairDB.findOne({
    id: context.log.log_address.toLowerCase(),
  });
  let pairDayData: IPairDayData = await pairDayDataDB.findOne({
    id: dayPairID,
  });

  pairDayData ??= await pairDayDataDB.create({
    id: dayPairID,
    date: dayStartTimestamp.toString(),
    token0: pair.token0,
    token1: pair.token1,
    totalSupply: ZERO_BI.toString(),
    pairAddress: context.log.log_address,
    dailyVolumeToken0: ZERO_BI.toString(),
    dailyVolumeToken1: ZERO_BI.toString(),
    dailyVolumeUSD: ZERO_BI.toString(),
    dailyTxns: ZERO_BI.toString(),
  });

  pairDayData.totalSupply = pair.totalSupply;
  pairDayData.reserve0 = pair.reserve0;
  pairDayData.reserve1 = pair.reserve1;
  pairDayData.reserveUSD = pair.reserveUSD;
  pairDayData.dailyTxns = new BigNumber(pairDayData.dailyTxns)
    .plus(ONE_BI)
    .toString();

  await pairDayDataDB.save(pairDayData);
  return pairDayData;
}

export async function updatePairHourData(
  context: IEventContext,
  PairHourDataDB: Instance,
  pairDB: Instance
) {
  const timestamp = context.block.block_timestamp;
  const hourIndex = Math.floor(parseInt(timestamp) / 3600); // get unique hour within unix history
  const hourStartUnix = hourIndex * 3600;
  const hourPairID = `${context.log.log_address.toLowerCase()}-${hourIndex}`;

  const pair: IPair = await pairDB.findOne({
    id: context.log.log_address.toLowerCase(),
  });
  let pairHourData: IPairHourData = await PairHourDataDB.findOne({
    id: hourPairID,
  });

  pairHourData ??= await PairHourDataDB.create({
    id: hourPairID,
    hourStartUnix: hourStartUnix.toString(),
    pair: context.log.log_address,
    hourlyVolumeToken0: ZERO_BI.toString(),
    hourlyVolumeToken1: ZERO_BI.toString(),
    hourlyVolumeUSD: ZERO_BI.toString(),
    hourlyTxns: ZERO_BI.toString(),
  });

  pairHourData.totalSupply = pair.totalSupply;
  pairHourData.reserve0 = pair.reserve0;
  pairHourData.reserve1 = pair.reserve1;
  pairHourData.reserveUSD = pair.reserveUSD;
  pairHourData.hourlyTxns = new BigNumber(pairHourData.hourlyTxns)
    .plus(ONE_BI)
    .toString();

  await PairHourDataDB.save(pairHourData);
  return pairHourData;
}

export async function updateUniswapDayData(
  context: IEventContext,
  UniswapDayDataDB: Instance,
  UniswapFactoryDB: Instance
) {
  const timestamp = context.block.block_timestamp;
  const dayID = Math.floor(parseInt(timestamp) / 86400);
  const dayStartTimestamp = dayID * 86400;

  let uniswapDayData = await UniswapDayDataDB.findOne({ id: dayID.toString() });

  uniswapDayData ??= await UniswapDayDataDB.create({
    id: dayID.toString(),
    date: dayStartTimestamp.toString(),
    dailyVolumeUSD: ZERO_BI.toString(),
    dailyVolumeETH: ZERO_BI.toString(),
    totalVolumeUSD: ZERO_BI.toString(),
    totalVolumeETH: ZERO_BI.toString(),
    dailyVolumeUntracked: ZERO_BI.toString(),
  });

  const uniswap: IUniswapFactory = await UniswapFactoryDB.findOne({
    id: FACTORY_ADDRESS.toLowerCase(),
  });

  uniswapDayData.totalLiquidityUSD = uniswap.totalLiquidityUSD;
  uniswapDayData.totalLiquidityETH = uniswap.totalLiquidityETH;
  uniswapDayData.txCount = uniswap.txCount;

  await UniswapDayDataDB.save(uniswapDayData);
  return uniswapDayData;
}

export async function updateTokenDayData(
  context: IEventContext,
  token: IToken,
  TokenDayDataDB: Instance,
  BundleDB: Instance
) {
  const bundle = await BundleDB.findOne({ id: "1" });
  const timestamp = context.block.block_timestamp;
  const dayID = Math.floor(parseInt(timestamp) / 86400);
  const dayStartTimestamp = dayID * 86400;
  const tokenDayID = `${token.id}-${dayID}`;

  let tokenDayData: ITokenDayData = await TokenDayDataDB.findOne({
    id: tokenDayID,
  });

  tokenDayData ??= await TokenDayDataDB.create({
    id: tokenDayID,
    date: dayStartTimestamp.toString(),
    token: token.id,
    priceUSD: new BigNumber(token.derivedETH).times(bundle.ethPrice).toString(),
    dailyVolumeToken: ZERO_BI.toString(),
    dailyVolumeETH: ZERO_BI.toString(),
    dailyVolumeUSD: ZERO_BI.toString(),
    dailyTxns: ZERO_BI.toString(),
    totalLiquidityUSD: ZERO_BI.toString(),
  });

  tokenDayData.priceUSD = new BigNumber(token.derivedETH)
    .times(bundle.ethPrice)
    .toString();
  tokenDayData.totalLiquidityToken = token.totalLiquidity;
  tokenDayData.totalLiquidityETH = new BigNumber(token.totalLiquidity)
    .times(token.derivedETH)
    .toString();
  tokenDayData.totalLiquidityUSD = new BigNumber(tokenDayData.totalLiquidityETH)
    .times(bundle.ethPrice)
    .toString();
  tokenDayData.dailyTxns = new BigNumber(tokenDayData.dailyTxns)
    .plus(ONE_BI)
    .toString();

  await TokenDayDataDB.save(tokenDayData);
  return tokenDayData;
}
