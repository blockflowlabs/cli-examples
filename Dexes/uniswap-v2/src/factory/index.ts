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
  const { event, block } = context;
  let { token0, token1, pair } = event;

  pair = pair.toString();
  token0 = token0.toString();
  token1 = token1.toString();

  await updateFactory(bind(UniswapFactory), bind(Bundle));
  await updateToken(bind(Token), token0);
  await updateToken(bind(Token), token1);

  {
    const pairDb = bind(Pair);
    await pairDb.create({
      id: pair.toLowerCase(),
      token0: token0.toLowerCase(),
      token1: token1.toLowerCase(),
      liquidityProviderCount: ZERO_BI.toString(),
      createdAtTimestamp: block.block_timestamp,
      createdAtBlockNumber: block.block_number,
      txCount: ZERO_BI.toString(),
      reserve0: ZERO_BI.toString(),
      reserve1: ZERO_BI.toString(),
      trackedReserveETH: ZERO_BI.toString(),
      reserveETH: ZERO_BI.toString(),
      reserveUSD: ZERO_BI.toString(),
      totalSupply: ZERO_BI.toString(),
      volumeToken0: ZERO_BI.toString(),
      volumeToken1: ZERO_BI.toString(),
      volumeUSD: ZERO_BI.toString(),
      untrackedVolumeUSD: ZERO_BI.toString(),
      token0Price: ZERO_BI.toString(),
      token1Price: ZERO_BI.toString(),
    });
  }
};

const createBundle = async (bundleDB: Instance) => {
  await bundleDB.create({
    id: "1",
    ethPrice: ZERO_BI.toString(),
  });
};

const updateFactory = async (factoryDB: Instance, IBundle: Instance) => {
  // load factory (create if first exchange)
  let factory: IUniswapFactory = await factoryDB.findOne({
    id: FACTORY_ADDRESS.toLowerCase(),
  });

  if (!factory) {
    factory = await factoryDB.create({
      id: FACTORY_ADDRESS.toLowerCase(),
      pairCount: ZERO_BI.toString(),
      totalVolumeETH: ZERO_BI.toString(),
      totalLiquidityETH: ZERO_BI.toString(),
      totalVolumeUSD: ZERO_BI.toString(),
      untrackedVolumeUSD: ZERO_BI.toString(),
      totalLiquidityUSD: ZERO_BI.toString(),
      txCount: ZERO_BI.toString(),
    });

    await createBundle(IBundle);
  }

  factory.pairCount = new BigNumber(factory.pairCount.toString())
    .plus(1)
    .toString();

  await factoryDB.save(factory);
};

const updateToken = async (tokenDB: Instance, token: string) => {
  let tokenInContext: IToken = await tokenDB.findOne({
    id: token.toLowerCase(),
  });

  tokenInContext ??= await tokenDB.create({
    id: token.toLowerCase(),
    derivedETH: ZERO_BI.toString(),
    tradeVolume: ZERO_BI.toString(),
    tradeVolumeUSD: ZERO_BI.toString(),
    untrackedVolumeUSD: ZERO_BI.toString(),
    totalLiquidity: ZERO_BI.toString(),
    txCount: ZERO_BI.toString(),
  });

  await tokenDB.save(tokenInContext);
};
