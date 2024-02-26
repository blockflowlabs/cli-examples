import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";

import {
  FACTORY_ADDRESS,
  createLiquidityPosition,
  createLiquiditySnapshot,
} from "../helper";

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
  Burn,
  IBurn,
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
 * @dev Event::Burn(address sender, uint256 amount0, uint256 amount1, address to)
 * @param context trigger object with contains {event: {sender ,amount0 ,amount1 ,to }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const BurnHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Burn here

  const { event, transaction, block, log } = context;
  let { sender, amount0, amount1, to } = event;

  amount0 = amount0.toString();
  amount1 = amount1.toString();

  const burnDB = bind(Burn);
  const pairDB: Instance = bind(Pair);
  const txDB: Instance = bind(Transaction);
  const factoryDB: Instance = bind(UniswapFactory);

  // prettier-ignore
  let tx: ITransaction = await txDB.findOne({ id: transaction.transaction_hash.toLowerCase() });
  if (!tx) return;

  let burns = tx.burns;
  let burn: IBurn = await burnDB.findOne({
    id: burns[burns.length - 1].toLowerCase(),
  });

  // update pair database
  let pair: IPair = await pairDB.findOne({ id: log.log_address.toLowerCase() });
  pair.txCount = new BigNumber(pair.txCount).plus(1).toString();
  await pairDB.updateOne({ id: log.log_address.toLowerCase() }, pair);

  // update factory database
  // prettier-ignore
  let uniswap: IUniswapFactory = await factoryDB.findOne({ id: FACTORY_ADDRESS.toLowerCase()});
  uniswap.txCount = new BigNumber(uniswap.txCount).plus(1).toString();
  await factoryDB.updateOne({ id: FACTORY_ADDRESS.toLowerCase() }, uniswap);

  // update tokens database
  const tokenDB = bind(Token);
  let token0: IToken = await tokenDB.findOne({ id: pair.token0.toLowerCase() });
  let token1: IToken = await tokenDB.findOne({ id: pair.token1.toLowerCase() });

  token0.txCount = new BigNumber(token0.txCount).plus(1).toString();
  token1.txCount = new BigNumber(token1.txCount).plus(1).toString();

  await tokenDB.updateOne({ id: pair.token0.toLowerCase() }, token0);
  await tokenDB.updateOne({ id: pair.token1.toLowerCase() }, token1);

  // taking both tokens as 18 decimals
  let token0Amount = new BigNumber(amount0).dividedBy(10 ** 18);
  let token1Amount = new BigNumber(amount1).dividedBy(10 ** 18);

  const bundleDB: Instance = bind(Bundle);
  const bundle: IBundle = await bundleDB.findOne({ id: "1" });
  let amountTotalUSD = new BigNumber(token1.derivedETH)
    .times(token1Amount)
    .plus(new BigNumber(token0.derivedETH).times(token0Amount))
    .times(bundle.ethPrice);

  // update burn
  burn.sender = sender;
  burn.amount0 = token0Amount.toString();
  burn.amount1 = token1Amount.toString();
  // burn.to = event.params.to
  burn.logIndex = log.log_index;
  burn.amountUSD = amountTotalUSD.toString();

  await burnDB.save(burn);

  // update the LP position
  const liquidityDB: Instance = bind(LiquidityPosition);
  const liquidityPosition = await createLiquidityPosition(
    log.log_address,
    burn.sender,
    liquidityDB,
    pairDB
  );

  await createLiquiditySnapshot(liquidityPosition, context, bind);
  await liquidityDB.save(liquidityPosition);

  // update analytics data
  await updatePairDayData(context, bind(PairDayData), pairDB);
  await updatePairHourData(context, bind(PairHourData), pairDB);
  await updateUniswapDayData(context, bind(UniswapDayData), factoryDB);
  await updateTokenDayData(context, token0, bind(TokenDayData), bundleDB);
  await updateTokenDayData(context, token1, bind(TokenDayData), bundleDB);
};
