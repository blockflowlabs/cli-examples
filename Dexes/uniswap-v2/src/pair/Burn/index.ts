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
export const BurnHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
) => {
  // Implement your event handler logic for Burn here
  const { event, transaction, block, log } = context;
  let { sender, amount0, amount1, to } = event;

  amount0 = amount0.toString();
  amount1 = amount1.toString();

  const burnDB = bind(Burn);
  const tokenDB = bind(Token);
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
  const pair = await updatePair(pairDB, log.log_address);

  // update factory database
  await updateFactory(factoryDB);

  // update tokens database
  const token0: IToken = await updateToken(tokenDB, pair.token0);
  const token1: IToken = await updateToken(tokenDB, pair.token1);

  let token0Amount = new BigNumber(amount0).dividedBy(
    10 ** parseInt(token0.decimals)
  );
  let token1Amount = new BigNumber(amount1).dividedBy(
    10 ** parseInt(token1.decimals)
  );

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

const updatePair = async (pairDB: Instance, address: string) => {
  let pair: IPair = await pairDB.findOne({ id: address.toLowerCase() });
  pair.txCount = new BigNumber(pair.txCount).plus(1).toString();
  await pairDB.save(pair);

  return pair;
};

const updateFactory = async (factoryDB: Instance) => {
  // prettier-ignore
  let uniswap: IUniswapFactory = await factoryDB.findOne({ id: FACTORY_ADDRESS.toLowerCase()});
  uniswap.txCount = new BigNumber(uniswap.txCount).plus(1).toString();
  await factoryDB.save(uniswap);
};

const updateToken = async (tokenDB: Instance, token: string) => {
  let _token: IToken = await tokenDB.findOne({ id: token.toLowerCase() });
  _token.txCount = new BigNumber(_token.txCount).plus(1).toString();
  await tokenDB.save(_token);

  return _token;
};
