import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";

import {
  UniswapFactory,
  IUniswapFactory,
  Bundle,
  IBundle,
  IToken,
  Token,
  Pair,
  IPair,
} from "../types/schema";

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

export let ZERO_BI = new BigNumber(0);
export let ONE_BI = new BigNumber(1);
export let BI_18 = new BigNumber(18);

/**
 * @dev Event::PairCreated(address token0, address token1, address pair, uint256 )
 * @param context trigger object with contains {event: {token0 ,token1 ,pair , }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PairCreatedHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  // Implement your event handler logic for PairCreated here
  const { event, transaction, block, log } = context;
  let { token0, token1, pair } = event;

  pair = pair.toString();
  token0 = token0.toString();
  token1 = token1.toString();

  await updateFactory(bind(UniswapFactory), bind(Bundle));
  await updateToken(bind(Token), token0);
  await updateToken(bind(Token), token1);

  {
    const pairDb = bind(Pair);
    let newPair: IPair = await pairDb.create({ id: pair.toLowerCase() });
    newPair.token0 = token0.toLowerCase();
    newPair.token1 = token1.toLowerCase();
    newPair.liquidityProviderCount = ZERO_BI.toString();
    newPair.createdAtTimestamp = block.block_timestamp;
    newPair.createdAtBlockNumber = block.block_number;
    newPair.txCount = ZERO_BI.toString();
    newPair.reserve0 = ZERO_BI.toString();
    newPair.reserve1 = ZERO_BI.toString();
    newPair.trackedReserveETH = ZERO_BI.toString();
    newPair.reserveETH = ZERO_BI.toString();
    newPair.reserveUSD = ZERO_BI.toString();
    newPair.totalSupply = ZERO_BI.toString();
    newPair.volumeToken0 = ZERO_BI.toString();
    newPair.volumeToken1 = ZERO_BI.toString();
    newPair.volumeUSD = ZERO_BI.toString();
    newPair.untrackedVolumeUSD = ZERO_BI.toString();
    newPair.token0Price = ZERO_BI.toString();
    newPair.token1Price = ZERO_BI.toString();

    await pairDb.save(newPair);
  }
};

const createBundle = async (bundleDB: Instance) => {
  // create new bundle
  let bundle: IBundle = await bundleDB.create({ id: "1" });
  bundle.ethPrice = ZERO_BI.toString();
  await bundleDB.save(bundle);
};

const updateFactory = async (factoryDB: Instance, IBundle: Instance) => {
  // load factory (create if first exchange)
  let factory: IUniswapFactory = await factoryDB.findOne({
    id: FACTORY_ADDRESS.toLowerCase(),
  });

  let firstBlood = false;
  if (!factory) {
    firstBlood = true;
    factory = await factoryDB.create({ id: FACTORY_ADDRESS.toLowerCase() });
    factory.pairCount = ZERO_BI.toString();
    factory.totalVolumeETH = ZERO_BI.toString();
    factory.totalLiquidityETH = ZERO_BI.toString();
    factory.totalVolumeUSD = ZERO_BI.toString();
    factory.untrackedVolumeUSD = ZERO_BI.toString();
    factory.totalLiquidityUSD = ZERO_BI.toString();
    factory.txCount = ZERO_BI.toString();

    await createBundle(IBundle);
  }

  factory.pairCount = new BigNumber(factory.pairCount.toString())
    .plus(1)
    .toString();

  if (firstBlood) await factoryDB.save(factory);
  else
    await factoryDB.updateOne({ id: FACTORY_ADDRESS.toLowerCase() }, factory);
};

const updateToken = async (tokenDB: Instance, token: string) => {
  let tokenInContext: IToken = await tokenDB.findOne({
    id: token.toLowerCase(),
  });
  let firstBlood = false;

  // fetch info if null
  if (!tokenInContext) {
    firstBlood = true;
    tokenInContext = await tokenDB.create({ id: token.toLowerCase() });
    tokenInContext.derivedETH = ZERO_BI.toString();
    tokenInContext.tradeVolume = ZERO_BI.toString();
    tokenInContext.tradeVolumeUSD = ZERO_BI.toString();
    tokenInContext.untrackedVolumeUSD = ZERO_BI.toString();
    tokenInContext.totalLiquidity = ZERO_BI.toString();
    tokenInContext.txCount = ZERO_BI.toString();
  }

  if (firstBlood) await tokenDB.save(tokenInContext);
  else await tokenDB.updateOne({ id: token.toLowerCase() }, tokenInContext);
};
