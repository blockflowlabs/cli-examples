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
  ILiquidityPositionSnapshot,
  IPairDayData,
  IPairHourData,
  IUniswapFactory,
  ITokenDayData,
} from "../types/schema";
s;
import { FACTORY_ADDRESS, ZERO_BI, ONE_BI } from "./helper";

export async function createLiquiditySnapshot(
  position: ILiquidityPosition,
  context: IEventContext,
  bind: IBind
) {
  let timestamp = context.block.block_timestamp;
  const bundleDB: Instance = bind(Bundle);
  const paidDB: Instance = bind(Pair);
  const tokenDB = bind(Token);

  const bundle: IBundle = await bundleDB.findOne({ id: "1" });
  let pair: IPair = await paidDB.findOne({ id: position.pair.toLowerCase() });
  let token0: IToken = await tokenDB.findOne({ id: pair.token0.toLowerCase() });
  let token1: IToken = await tokenDB.findOne({ id: pair.token1.toLowerCase() });

  // create new snapshot
  const snapshotDB: Instance = bind(LiquidityPositionSnapshot);
  let snapshot: ILiquidityPositionSnapshot = await snapshotDB.create({
    id: position.id.concat(timestamp.toString()).toLowerCase(),
  });

  snapshot.liquidityPosition = position.id;
  snapshot.timestamp = timestamp;
  snapshot.user = position.user;
  snapshot.pair = position.pair;
  snapshot.token0PriceUSD = new BigNumber(token0.derivedETH)
    .times(bundle.ethPrice)
    .toString();
  snapshot.token1PriceUSD = new BigNumber(token1.derivedETH)
    .times(bundle.ethPrice)
    .toString();
  snapshot.reserve0 = pair.reserve0;
  snapshot.reserve1 = pair.reserve1;
  snapshot.reserveUSD = pair.reserveUSD;
  snapshot.liquidityTokenTotalSupply = pair.totalSupply;
  snapshot.liquidityTokenBalance = position.liquidityTokenBalance;
  snapshot.liquidityPosition = position.id;

  await snapshotDB.save(snapshot);
}

export async function updatePairDayData(
  context: IEventContext,
  pairDayDataDB: Instance,
  pairDB: Instance
) {
  let timestamp = new BigNumber(
    new Date(context.block.block_timestamp).getTime().toString()
  );
  let dayID = timestamp.div(86400);
  let dayStartTimestamp = dayID.multipliedBy(86400);
  let dayPairID = context.log.log_address
    .concat("-")
    .concat(dayID.toString())
    .toLowerCase();

  let pair: IPair = await pairDB.findOne({
    id: context.log.log_address.toLowerCase(),
  });
  let pairDayData: IPairDayData = await pairDayDataDB.findOne({
    id: dayPairID,
  });
  let firstBlood = false;
  if (!pairDayData) {
    firstBlood = true;
    pairDayData = await pairDayDataDB.create({ id: dayPairID });
    pairDayData.date = dayStartTimestamp.toString();
    pairDayData.token0 = pair.token0;
    pairDayData.token1 = pair.token1;
    pairDayData.pairAddress = context.log.log_address;
    pairDayData.dailyVolumeToken0 = ZERO_BI.toString();
    pairDayData.dailyVolumeToken1 = ZERO_BI.toString();
    pairDayData.dailyVolumeUSD = ZERO_BI.toString();
    pairDayData.dailyTxns = ZERO_BI.toString();
  }

  pairDayData.totalSupply = pair.totalSupply;
  pairDayData.reserve0 = pair.reserve0;
  pairDayData.reserve1 = pair.reserve1;
  pairDayData.reserveUSD = pair.reserveUSD;
  pairDayData.dailyTxns = new BigNumber(pairDayData.dailyTxns)
    .plus(ONE_BI)
    .toString();

  if (firstBlood) await pairDayDataDB.save(pairDayData);
  else await pairDayDataDB.updateOne({ id: dayPairID }, pairDayData);

  return pairDayData;
}

export async function updatePairHourData(
  context: IEventContext,
  PairHourDataDB: Instance,
  pairDB: Instance
) {
  let timestamp = new BigNumber(
    new Date(context.block.block_timestamp).getTime().toString()
  );
  let hourIndex = timestamp.div(3600); // get unique hour within unix history
  let hourStartUnix = hourIndex.multipliedBy(3600).toString(); // want the rounded effect
  let hourPairID = context.log.log_address
    .concat("-")
    .concat(hourIndex.toString())
    .toLowerCase();

  let pair: IPair = await pairDB.findOne({
    id: context.log.log_address.toLowerCase(),
  });
  let pairHourData: IPairHourData = await PairHourDataDB.findOne({
    id: hourPairID,
  });
  let firstBlood = false;
  if (!pairHourData) {
    firstBlood = true;
    pairHourData = await PairHourDataDB.create({ id: hourPairID });
    pairHourData.hourStartUnix = hourStartUnix;
    pairHourData.pair = context.log.log_address;
    pairHourData.hourlyVolumeToken0 = ZERO_BI.toString();
    pairHourData.hourlyVolumeToken1 = ZERO_BI.toString();
    pairHourData.hourlyVolumeUSD = ZERO_BI.toString();
    pairHourData.hourlyTxns = ZERO_BI.toString();
  }

  pairHourData.totalSupply = pair.totalSupply;
  pairHourData.reserve0 = pair.reserve0;
  pairHourData.reserve1 = pair.reserve1;
  pairHourData.reserveUSD = pair.reserveUSD;
  pairHourData.hourlyTxns = new BigNumber(pairHourData.hourlyTxns)
    .plus(ONE_BI)
    .toString();
  pairHourData.save();

  if (firstBlood) await PairHourDataDB.save(pairHourData);
  else await PairHourDataDB.updateOne({ id: hourPairID }, pairHourData);

  return pairHourData;
}

export async function updateUniswapDayData(
  context: IEventContext,
  UniswapDayDataDB: Instance,
  UniswapFactoryDB: Instance
) {
  let timestamp = new BigNumber(
    new Date(context.block.block_timestamp).getTime().toString()
  );
  let dayID = timestamp.div(86400);
  let dayStartTimestamp = dayID.multipliedBy(86400).toString();

  let uniswapDayData = await UniswapDayDataDB.findOne({ id: dayID.toString() });
  let firstBlood = false;
  if (!uniswapDayData) {
    firstBlood = true;
    uniswapDayData = await UniswapDayDataDB.create({ id: dayID.toString() });
    uniswapDayData.date = dayStartTimestamp;
    uniswapDayData.dailyVolumeUSD = ZERO_BI.toString();
    uniswapDayData.dailyVolumeETH = ZERO_BI.toString();
    uniswapDayData.totalVolumeUSD = ZERO_BI.toString();
    uniswapDayData.totalVolumeETH = ZERO_BI.toString();
    uniswapDayData.dailyVolumeUntracked = ZERO_BI.toString();
  }

  let uniswap: IUniswapFactory = await UniswapFactoryDB.findOne({
    id: FACTORY_ADDRESS.toLowerCase(),
  });

  uniswapDayData.totalLiquidityUSD = uniswap.totalLiquidityUSD;
  uniswapDayData.totalLiquidityETH = uniswap.totalLiquidityETH;
  uniswapDayData.txCount = uniswap.txCount;

  if (firstBlood) await UniswapDayDataDB.save(uniswapDayData);
  else
    await UniswapDayDataDB.updateOne({ id: dayID.toString() }, uniswapDayData);

  return uniswapDayData;
}

export async function updateTokenDayData(
  context: IEventContext,
  token: IToken,
  TokenDayDataDB: Instance,
  BundleDB: Instance
) {
  let bundle = await BundleDB.findOne({ id: "1" });
  let timestamp = new BigNumber(
    new Date(context.block.block_timestamp).getTime().toString()
  );
  let dayID = timestamp.div(86400);
  let dayStartTimestamp = dayID.multipliedBy(86400).toString();
  let tokenDayID = token.id.toString().concat("-").concat(dayID.toString());

  let tokenDayData: ITokenDayData = await TokenDayDataDB.findOne({
    id: tokenDayID,
  });
  let firstBlood = false;
  if (!tokenDayData) {
    firstBlood = true;
    tokenDayData = await TokenDayDataDB.create({ id: tokenDayID });
    tokenDayData.date = dayStartTimestamp;
    tokenDayData.token = token.id;
    tokenDayData.priceUSD = new BigNumber(token.derivedETH)
      .times(bundle.ethPrice)
      .toString();
    tokenDayData.dailyVolumeToken = ZERO_BI.toString();
    tokenDayData.dailyVolumeETH = ZERO_BI.toString();
    tokenDayData.dailyVolumeUSD = ZERO_BI.toString();
    tokenDayData.dailyTxns = ZERO_BI.toString();
    tokenDayData.totalLiquidityUSD = ZERO_BI.toString();
  }

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

  if (firstBlood) await TokenDayDataDB.save(tokenDayData);
  else await TokenDayDataDB.updateOne({ id: tokenDayID }, tokenDayData);

  return tokenDayData;
}
