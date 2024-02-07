import { BigNumber } from "bignumber.js";

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
} from "../types/schema";
import { IBind, IEventContext, Instance } from "@blockflow-labs/utils";

// rebass tokens, dont count in tracked volume
export const UNTRACKED_PAIRS: string[] = [
  "0x9ea3b5b4ec044b70375236a281986106457b20ef",
];
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
export const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

export let ZERO_BI = new BigNumber(0);
export let ONE_BI = new BigNumber(1);
export let BI_18 = new BigNumber(18);

export async function createLiquidityPosition(
  exchange: string,
  user: string,
  liquidityDB: Instance,
  pairDB: Instance
) {
  let id = exchange.concat("-").concat(user).toLowerCase();
  let liquidityPosition: ILiquidityPosition = await liquidityDB.findOne({
    id,
  });
  let firstBlood = false;
  if (!liquidityPosition) {
    firstBlood = true;
    let pair: IPair = await pairDB.create({ id: exchange.toLowerCase() });
    liquidityPosition = await liquidityDB.create({ id });

    pair.liquidityProviderCount = new BigNumber(pair.liquidityProviderCount)
      .plus(1)
      .toString();
    liquidityPosition.liquidityTokenBalance = ZERO_BI.toString();
    liquidityPosition.pair = exchange.toLowerCase();
    liquidityPosition.user = user.toLowerCase();

    await pairDB.save(pair);
    await liquidityDB.save(liquidityPosition);
  }
  return { liquidityPosition, firstBlood };
}

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

export async function createUser(address: string, userDB: Instance) {
  let user = await userDB.findOne({ id: address.toLowerCase() });
  if (!user) {
    user = await userDB.create({ id: address.toLowerCase() });
    user.usdSwapped = ZERO_BI.toString();
    await userDB.save(user);
  }
}

export const convertTokenToDecimal = (
  amount: string,
  decimals = 18
): string => {
  return new BigNumber(amount).dividedBy(10 ** decimals).toString();
};
