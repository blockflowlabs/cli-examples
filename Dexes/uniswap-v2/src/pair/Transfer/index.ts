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

import {
  IPair,
  IToken,
  IBundle,
  ITransaction,
  IUniswapFactory,
  ISwap,
  IUniswapDayData,
} from "../../types/schema";

async function isCompleteMint(
  mintId: string,
  MintDB: Instance
): Promise<boolean> {
  return (
    ((await MintDB.findOne({ id: mintId.toLowerCase() })) as IMint).sender !==
    null
  ); // sufficient checks
}

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const TransferHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  let { from, to, value } = event;

  value = value.toString();

  // ignore initial transfers for first adds
  if (to == ADDRESS_ZERO && new BigNumber(value).eq(1000)) return;

  {
    const UserDB = bind(User);
    await createUser(from, UserDB);
    await createUser(to, UserDB);
  }

  const pairDB: Instance = bind(Pair);
  let pair: IPair = await pairDB.findOne({ id: log.log_address.toLowerCase() });

  value = convertTokenToDecimal(value, 18);

  const txDB: Instance = bind(Transaction);
  let tx: ITransaction = await txDB.findOne({
    id: transaction.transaction_hash.toLowerCase(),
  });
  let firstBlood = false;

  if (!tx) {
    firstBlood = true;
    tx = await txDB.create({ id: transaction.transaction_hash.toLowerCase() });
    tx.timestamp = event.block.timestamp;
  }

  if (from == ADDRESS_ZERO) {
    // mints
    let mints = tx.mints;

    // update total supply
    pair.totalSupply = new BigNumber(pair.totalSupply).plus(value).toString();
    await pairDB.updateOne({ id: pair.id }, pair);

    // create new mint if no mints so far or if last one is done already
    const MintDB: Instance = bind(Mint);
    if (
      Number(mints.length) === 0 ||
      (await isCompleteMint(mints[mints.length - 1], MintDB))
    ) {
      let mint: IMint = await MintDB.create({
        id: transaction.transaction_hash
          .concat("-")
          .concat(mints.length.toString())
          .toLowerCase(),
      });

      mint.transaction = tx.id;
      mint.pair = pair.id;
      mint.to = to;
      mint.liquidity = value;
      mint.timestamp = new BigNumber(
        new Date(block.block_timestamp).getTime().toString()
      ).toString();

      await MintDB.save(mint);

      // update mints in transaction
      tx.mints.push(mint.id);
    }

    // case where direct send first on ETH withdrawls
    if (to.toLowerCase() === pair.id.toLowerCase()) {
      const burnDB = bind(Burn);
      let burn: IBurn = await burnDB.create({
        id: transaction.transaction_hash
          .concat("-")
          .concat(tx.burns.length.toString())
          .toLowerCase(),
      });

      burn.transaction = tx.id;
      burn.pair = pair.id;
      burn.liquidity = value;
      burn.timestamp = new BigNumber(
        new Date(block.block_timestamp).getTime().toString()
      ).toString();
      burn.to = event.params.to;
      burn.sender = event.params.from;
      burn.needsComplete = true;

      await burnDB.save(burn);

      // TODO: Consider using .concat() for handling array updates to protect
      // against unintended side effects for other code paths.
      tx.burns.push(burn.id);
    }

    // burn
    if (to == ADDRESS_ZERO && from.toLowerCase() == pair.id.toLowerCase()) {
      pair.totalSupply = new BigNumber(pair.totalSupply)
        .minus(value)
        .toString();
      await pairDB.updateOne({ id: pair.id }, pair);

      // this is a new instance of a logical burn
      let burns = tx.burns;
      let burn: IBurn;
      const burnDB = bind(Burn);
      let burnFirstBlood = false;
      if (burns.length > 0) {
        let currentBurn: IBurn = await burnDB.findOne({
          id: burns[burns.length - 1].toLowerCase(),
        });
        if (currentBurn.needsComplete) {
          burn = currentBurn;
        } else {
          burnFirstBlood = true;
          burn = await burnDB.create({
            id: transaction.transaction_hash
              .concat("-")
              .concat(tx.burns.length.toString())
              .toLowerCase(),
          });
          burn.transaction = tx.id;
          burn.needsComplete = false;
          burn.pair = pair.id;
          burn.liquidity = value;
          burn.timestamp = new BigNumber(
            new Date(block.block_timestamp).getTime().toString()
          ).toString();
        }
      } else {
        burnFirstBlood = true;
        burn = await burnDB.create({
          id: transaction.transaction_hash
            .concat("-")
            .concat(tx.burns.length.toString())
            .toLowerCase(),
        });
        burn.transaction = tx.id;
        burn.needsComplete = false;
        burn.pair = pair.id;
        burn.liquidity = value;
        burn.timestamp = new BigNumber(
          new Date(block.block_timestamp).getTime().toString()
        ).toString();
      }

      // if this logical burn included a fee mint, account for this
      if (
        Number(mints.length) !== 0 &&
        !(await isCompleteMint(mints[mints.length - 1], MintDB))
      ) {
        let mint: IMint = await MintDB.findOne({
          id: mints[mints.length - 1].toLowerCase(),
        });
        burn.feeTo = mint.to;
        burn.feeLiquidity = mint.liquidity;

        // remove the logical mint
        await MintDB.deleteOne({ id: mints[mints.length - 1].toLowerCase() });

        // TODO: Consider using .slice().pop() to protect against unintended
        // side effects for other code paths.
        mints.pop();
        tx.mints = mints;
      }

      if (burnFirstBlood) await burnDB.save(burn);
      else await burnDB.updateOne({ id: burn.id }, burn);

      // if accessing last one, replace it
      if (burn.needsComplete) {
        burns[burns.length - 1] = burn.id;
      } else {
        burns.push(burn.id);
      }

      tx.burns = burns;
    }

    // prettier-ignore
    {
      if (from != ADDRESS_ZERO && from.toLowerCase() != pair.id.toLowerCase()) {
        // update the LP position
        const liquidityDB: Instance = bind(LiquidityPosition);
        let { liquidityPosition, firstBlood } = await createLiquidityPosition(log.log_address, from, liquidityDB, pairDB)
        // fromUserLiquidityPosition.liquidityTokenBalance = convertTokenToDecimal(pairContract.balanceOf(from), BI_18)
        await createLiquiditySnapshot(liquidityPosition, context, bind);

        if (firstBlood) await liquidityDB.save(liquidityPosition);
        else
          await liquidityDB.updateOne(
            { id: liquidityPosition.id.toLowerCase() },
            liquidityPosition
          );
      }

      if (to != ADDRESS_ZERO && to.toLowerCase() != pair.id.toLowerCase()) {
        // update the LP position
        const liquidityDB: Instance = bind(LiquidityPosition);
        let { liquidityPosition, firstBlood } = await createLiquidityPosition(log.log_address, to, liquidityDB, pairDB)
        // toUserLiquidityPosition.liquidityTokenBalance = convertTokenToDecimal(pairContract.balanceOf(to), BI_18)
        await createLiquiditySnapshot(liquidityPosition, context, bind);

        if (firstBlood) await liquidityDB.save(liquidityPosition);
        else
          await liquidityDB.updateOne(
            { id: liquidityPosition.id.toLowerCase() },
            liquidityPosition
          );
      }
    }

    if (firstBlood) await txDB.save(tx);
    else
      await txDB.updateOne(
        { id: transaction.transaction_hash.toLowerCase() },
        tx
      );
  }
};
