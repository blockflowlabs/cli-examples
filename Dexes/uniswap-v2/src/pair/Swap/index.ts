import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";

import { getTrackedVolumeUSD } from "../price";
import {
  ONE_BI,
  ZERO_BI,
  FACTORY_ADDRESS,
  convertTokenToDecimal,
} from "../helper";

import {
  updatePairDayData,
  updatePairHourData,
  updateTokenDayData,
  updateUniswapDayData,
} from "../dayUpdates";

import {
  Swap,
  Pair,
  Bundle,
  Token,
  Transaction,
  PairDayData,
  TokenDayData,
  PairHourData,
  UniswapFactory,
  UniswapDayData,
} from "../../types/schema";

import {
  IPair,
  IToken,
  IBundle,
  ITransaction,
  IUniswapFactory,
  ISwap,
  IUniswapDayData,
} from "../../types/schema";

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param context trigger object with contains {event: {sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const SwapHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
) => {
  // Implement your event handler logic for Swap here

  const { event, transaction, block, log } = context;
  let { sender, amount0In, amount1In, amount0Out, amount1Out, to } = event;

  amount0In = amount0In.toString();
  amount1In = amount1In.toString();
  amount0Out = amount0Out.toString();
  amount1Out = amount1Out.toString();

  const pairDB: Instance = bind(Pair);
  let pair: IPair = await pairDB.findOne({ id: log.log_address.toLowerCase() });

  const tokenDB = bind(Token);
  let token0: IToken = await tokenDB.findOne({ id: pair.token0.toLowerCase() });
  let token1: IToken = await tokenDB.findOne({ id: pair.token1.toLowerCase() });

  // @dev 18 decimals conversion
  amount0In = convertTokenToDecimal(amount0In, 18);
  amount1In = convertTokenToDecimal(amount1In, 18);
  amount0Out = convertTokenToDecimal(amount0Out, 18);
  amount1Out = convertTokenToDecimal(amount1Out, 18);

  // totals for volume updates
  let amount0Total = new BigNumber(amount0Out).plus(amount0In).toString();
  let amount1Total = new BigNumber(amount1Out).plus(amount1In).toString();

  // ETH/USD prices
  const bundleDB: Instance = bind(Bundle);
  const bundle: IBundle = await bundleDB.findOne({ id: "1" });

  // get total amounts of derived USD and ETH for tracking
  let derivedAmountETH = new BigNumber(token1.derivedETH)
    .times(amount1Total)
    .plus(new BigNumber(token0.derivedETH).times(amount0Total))
    .div(2);

  let derivedAmountUSD = derivedAmountETH.times(bundle.ethPrice);

  // only accounts for volume through white listed tokens
  let trackedAmountUSD = getTrackedVolumeUSD(
    amount0Total,
    token0,
    amount1Total,
    token1,
    pair,
    bundle
  );

  let trackedAmountETH: string;
  if (new BigNumber(bundle.ethPrice).eq(ZERO_BI)) {
    trackedAmountETH = ZERO_BI.toString();
  } else {
    trackedAmountETH = new BigNumber(trackedAmountUSD)
      .div(bundle.ethPrice)
      .toString();
  }

  // update token0 global volume and token liquidity stats
  token0.tradeVolume = new BigNumber(token0.tradeVolume)
    .plus(amount0In.plus(amount0Out))
    .toString();
  token0.tradeVolumeUSD = new BigNumber(token0.tradeVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  token0.untrackedVolumeUSD = new BigNumber(token0.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();

  // update token1 global volume and token liquidity stats
  token1.tradeVolume = new BigNumber(token1.tradeVolume)
    .plus(amount1In.plus(amount1Out))
    .toString();
  token1.tradeVolumeUSD = new BigNumber(token1.tradeVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  token1.untrackedVolumeUSD = new BigNumber(token1.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();

  // update txn counts
  token0.txCount = new BigNumber(token0.txCount).plus(ONE_BI).toString();
  token1.txCount = new BigNumber(token1.txCount).plus(ONE_BI).toString();

  await tokenDB.save(token0);
  await tokenDB.save(token1);

  // update pair volume data, use tracked amount if we have it as its probably more accurate
  pair.volumeUSD = new BigNumber(pair.volumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  pair.volumeToken0 = new BigNumber(pair.volumeToken0)
    .plus(amount0Total)
    .toString();
  pair.volumeToken1 = new BigNumber(pair.volumeToken1)
    .plus(amount1Total)
    .toString();
  pair.untrackedVolumeUSD = new BigNumber(pair.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();
  pair.txCount = new BigNumber(pair.txCount).plus(ONE_BI).toString();
  await pairDB.save(pair);

  const factoryDB: Instance = bind(UniswapFactory);
  let uniswap: IUniswapFactory = await factoryDB.findOne({
    id: FACTORY_ADDRESS.toLowerCase(),
  });
  uniswap.totalVolumeUSD = new BigNumber(uniswap.totalVolumeUSD)
    .plus(trackedAmountUSD)
    .toString();
  uniswap.totalVolumeETH = new BigNumber(uniswap.totalVolumeETH)
    .plus(trackedAmountETH)
    .toString();
  uniswap.untrackedVolumeUSD = new BigNumber(uniswap.untrackedVolumeUSD)
    .plus(derivedAmountUSD)
    .toString();
  uniswap.txCount = new BigNumber(uniswap.txCount).plus(ONE_BI).toString();
  await factoryDB.save(uniswap);

  const txDB: Instance = bind(Transaction);
  let tx: ITransaction = await txDB.findOne({
    id: transaction.transaction_hash.toLowerCase(),
  });

  tx ??= await txDB.create({
    id: transaction.transaction_hash.toLowerCase(),
    timestamp: block.block_timestamp,
  });

  let swaps = tx.swaps;
  const swapDB = bind(Swap);
  let swap: ISwap = await swapDB.create({
    id: context.transaction.transaction_hash
      .concat("-")
      .concat(swaps.length.toString())
      .toLowerCase(),
    transaction: tx.id,
    pair: pair.id,
    timestamp: tx.timestamp,
    sender: sender,
    amount0In: amount0In,
    amount1In: amount1In,
    amount0Out: amount0Out,
    amount1Out: amount1Out,
    to: to,
    from: transaction.transaction_from_address,
    logIndex: log.log_index,
    // use the tracked amount if we have it
    amountUSD:
      trackedAmountUSD === ZERO_BI.toString()
        ? derivedAmountUSD.toString()
        : trackedAmountUSD.toString(),
  });

  tx.swaps.push(swap.id);
  await txDB.save(tx);

  // prettier-ignore
  {
    const PairDayDataDB = bind(PairDayData)
    let pairDayData = await updatePairDayData(context, PairDayDataDB, pairDB);

    // swap specific updating for pair
    pairDayData.dailyVolumeToken0 = new BigNumber(pairDayData.dailyVolumeToken0).plus(amount0Total).toString();
    pairDayData.dailyVolumeToken1 = new BigNumber(pairDayData.dailyVolumeToken1).plus(amount1Total).toString();
    pairDayData.dailyVolumeUSD = new BigNumber(pairDayData.dailyVolumeUSD).plus(trackedAmountUSD).toString();
    await PairDayDataDB.save(pairDayData)
  }

  // prettier-ignore
  {
    const PairHourDataDB = bind(PairHourData)
    let pairHourData =  await updatePairHourData(context, PairHourDataDB, pairDB);

    // update hourly pair data
    pairHourData.hourlyVolumeToken0 = new BigNumber(pairHourData.hourlyVolumeToken0).plus(amount0Total).toString();
    pairHourData.hourlyVolumeToken1 = new BigNumber(pairHourData.hourlyVolumeToken1).plus(amount1Total).toString();
    pairHourData.hourlyVolumeUSD = new BigNumber(pairHourData.hourlyVolumeUSD).plus(trackedAmountUSD).toString();
    await PairHourDataDB.save(pairHourData)
  }

  // prettier-ignore
  {
    const UniswapDayDataDB = bind(UniswapDayData)
    let uniswapDayData: IUniswapDayData =  await updateUniswapDayData(context, UniswapDayDataDB, factoryDB);

    // swap specific updating
    uniswapDayData.dailyVolumeUSD = new BigNumber(uniswapDayData.dailyVolumeUSD).plus(trackedAmountUSD).toString();
    uniswapDayData.dailyVolumeETH = new BigNumber(uniswapDayData.dailyVolumeETH).plus(trackedAmountETH).toString();
    uniswapDayData.dailyVolumeUntracked = new BigNumber(uniswapDayData.dailyVolumeUntracked).plus(derivedAmountUSD).toString();
    await UniswapDayDataDB.save(uniswapDayData)
  }

  const TokenDayDataDB = bind(TokenDayData);
  // prettier-ignore
  {
    let token0DayData =  await updateTokenDayData(context, token0, TokenDayDataDB, bundleDB);

    // swap specific updating for token0
    token0DayData.dailyVolumeToken = new BigNumber(token0DayData.dailyVolumeToken).plus(amount0Total).toString();
    token0DayData.dailyVolumeETH = new BigNumber(token0DayData.dailyVolumeETH).plus(new BigNumber(amount0Total).times(token0.derivedETH)).toString();
    token0DayData.dailyVolumeUSD = new BigNumber(token0DayData.dailyVolumeUSD).plus(
      new BigNumber(amount0Total).times(token0.derivedETH).times(bundle.ethPrice)
    ).toString();

    await TokenDayDataDB.save(token0DayData)
  }

  // prettier-ignore
  {
    let token1DayData =await updateTokenDayData(context, token1, TokenDayDataDB, bundleDB);
    
    // swap specific updating
    token1DayData.dailyVolumeToken = new BigNumber(token1DayData.dailyVolumeToken).plus(amount1Total).toString();
    token1DayData.dailyVolumeETH = new BigNumber(token1DayData.dailyVolumeETH).plus(new BigNumber(amount1Total).times(token1.derivedETH)).toString();
    token1DayData.dailyVolumeUSD = new BigNumber(token1DayData.dailyVolumeUSD).plus(
      new BigNumber(amount1Total).times(token1.derivedETH).times(bundle.ethPrice)
    ).toString();

    await TokenDayDataDB.save(token1DayData)
  }
};
