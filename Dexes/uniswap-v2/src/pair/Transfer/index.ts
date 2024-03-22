import { BigNumber } from "bignumber.js";
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  ADDRESS_ZERO,
  createUser,
  convertTokenToDecimal,
  createLiquidityPosition,
  createLiquiditySnapshot,
} from "../helper";

import {
  Burn,
  Mint,
  User,
  LiquidityPosition,
  Pair,
  Transaction,
  IMint,
  IBurn,
} from "../../types/schema";

import { IPair, ITransaction } from "../../types/schema";

async function isCompleteMint(
  mintId: string,
  MintDB: Instance
): Promise<boolean> {
  return (
    ((await MintDB.findOne({ id: mintId.toLowerCase() })) as IMint).sender !==
    null
  ); // sufficient checks
}

export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
) => {
  const { event, transaction, block, log } = context;
  let { from, to, value } = event;

  from = from.toString();
  to = to.toString();
  value = value.toString();

  // Ignore initial transfers for first adds
  if (to == ADDRESS_ZERO && new BigNumber(value).eq(1000)) return;

  const UserDB = bind(User);
  await createUser(from, UserDB);
  await createUser(to, UserDB);

  const pairDB: Instance = bind(Pair);
  let pair: IPair = await pairDB.findOne({ id: log.log_address.toLowerCase() });

  value = convertTokenToDecimal(value, 18);

  const txDB: Instance = bind(Transaction);
  let tx: ITransaction = await txDB.findOne({
    id: transaction.transaction_hash.toLowerCase(),
  });

  tx ??= await txDB.create({
    id: transaction.transaction_hash.toLowerCase(),
    timestamp: block.block_timestamp,
  });

  if (from === ADDRESS_ZERO) {
    // Mints
    const mints = tx.mints;
    const MintDB: Instance = bind(Mint);

    // Update total supply
    pair.totalSupply = new BigNumber(pair.totalSupply).plus(value).toString();
    await pairDB.save(pair);

    // Create new mint if no mints so far or if last one is done already
    if (
      Number(mints.length) === 0 ||
      (await isCompleteMint(mints[mints.length - 1], MintDB))
    ) {
      let mint: IMint = await MintDB.create({
        id: transaction.transaction_hash
          .concat("-")
          .concat(mints.length.toString())
          .toLowerCase(),
        transaction: tx.id,
        pair: pair.id,
        to: to,
        liquidity: value,
        timestamp: block.block_timestamp,
      });

      tx.mints.push(mint.id);
    }
  } else if (to === ADDRESS_ZERO) {
    // Burns
    const burns = tx.burns;
    const burnDB = bind(Burn);

    // Update total supply
    pair.totalSupply = new BigNumber(pair.totalSupply).minus(value).toString();
    await pairDB.save(pair);

    let burn: IBurn;
    if (Number(burns.length) > 0) {
      let currentBurn: IBurn = await burnDB.findOne({
        id: burns[burns.length - 1].toLowerCase(),
      });
      if (currentBurn.needsComplete) {
        burn = currentBurn;
      } else {
        burn = await burnDB.create({
          id: transaction.transaction_hash
            .concat("-")
            .concat(burns.length.toString())
            .toLowerCase(),
          transaction: tx.id,
          needsComplete: false,
          pair: pair.id,
          liquidity: value,
          timestamp: block.block_timestamp,
        });
        tx.burns.push(burn.id);
      }
    } else {
      burn = await burnDB.create({
        id: transaction.transaction_hash
          .concat("-")
          .concat(burns.length.toString())
          .toLowerCase(),
        transaction: tx.id,
        needsComplete: false,
        pair: pair.id,
        liquidity: value,
        timestamp: block.block_timestamp,
      });
      tx.burns.push(burn.id);
    }

    // Check if the burn includes a fee mint
    const mints = tx.mints;
    const MintDB: Instance = bind(Mint);
    if (
      Number(mints.length) > 0 &&
      !(await isCompleteMint(mints[mints.length - 1], MintDB))
    ) {
      let mint: IMint = await MintDB.findOne({
        id: mints[mints.length - 1].toLowerCase(),
      });
      burn.feeTo = mint.to;
      burn.feeLiquidity = mint.liquidity;

      await MintDB.deleteOne({ id: mints[mints.length - 1].toLowerCase() });
      tx.mints.pop();
    }

    await burnDB.save(burn);
  }

  // Update liquidity positions
  const liquidityDB: Instance = bind(LiquidityPosition);
  if (from != ADDRESS_ZERO && from.toLowerCase() != pair.id.toLowerCase()) {
    let liquidityPosition = await createLiquidityPosition(
      log.log_address,
      from,
      liquidityDB,
      pairDB
    );
    await createLiquiditySnapshot(liquidityPosition, context, bind);
    await liquidityDB.save(liquidityPosition);
  }

  if (to != ADDRESS_ZERO && to.toLowerCase() != pair.id.toLowerCase()) {
    let liquidityPosition = await createLiquidityPosition(
      log.log_address,
      to,
      liquidityDB,
      pairDB
    );
    await createLiquiditySnapshot(liquidityPosition, context, bind);
    await liquidityDB.save(liquidityPosition);
  }

  await txDB.save(tx);
};
