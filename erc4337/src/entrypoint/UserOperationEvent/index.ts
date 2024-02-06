import { BigNumber } from "bignumber.js";
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  UserOperation,
  Bundler,
  Account,
  Paymaster,
  Blockchain,
  IUserOperation as XUserOperation,
} from "../../types/schema";

/**
 * @dev Event::UserOperationEvent(bytes32 userOpHash, address sender, address paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)
 * @param context trigger object with contains {event: {userOpHash ,sender ,paymaster ,nonce ,success ,actualGasCost ,actualGasUsed }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserOperationEventHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  try {
    // Implement your event handler logic for UserOperationEvent here

    const { event, transaction, block, log } = context;
    let {
      userOpHash,
      sender,
      paymaster,
      nonce,
      success,
      actualGasCost,
      actualGasUsed,
    } = event;

    nonce = nonce.toString();
    sender = sender.toString();
    paymaster = paymaster.toString();
    userOpHash = userOpHash.toString();
    actualGasCost = actualGasCost.toString();
    actualGasUsed = actualGasUsed.toString();

    await updateBlockchain(bind(Blockchain));
    // prettier-ignore
    await updatePaymaster(bind(Paymaster), block.block_timestamp, paymaster, userOpHash);
    // prettier-ignore
    await updateBundler(bind(Bundler), block.block_timestamp, transaction.transaction_from_address, userOpHash);

    const IAccount = bind(Account);
    let account = await IAccount.findOne({ id: sender.toLowerCase() });
    let firstBlood = false;
    if (!account) {
      firstBlood = true;
      account = await IAccount.create({ id: sender.toLowerCase() });

      account.totalOperations = "0";
      account.createdOpHash = userOpHash;
      account.paymaster = paymaster.toLowerCase();
      account.createdAt = block.block_timestamp;
      account.createdHash = transaction.transaction_hash;
    }

    account.ops.push(userOpHash);
    account.totalOperations = new BigNumber(account.totalOperations)
      .plus(1)
      .toString();
    account.updatedAt = block.block_timestamp;

    if (firstBlood) await IAccount.save(account);
    else await IAccount.updateOne({ id: sender.toLowerCase() }, account);

    const IUserOp = bind(UserOperation);
    firstBlood = false;
    let userOp: XUserOperation = await IUserOp.findOne({
      id: userOpHash.toLowerCase(),
    });
    if (!userOp) {
      firstBlood = true;
      userOp = await IUserOp.create({ id: userOpHash.toLowerCase() });
    }

    userOp.bundler = transaction.transaction_from_address.toLowerCase();
    userOp.paymaster = paymaster.toLowerCase();
    userOp.sender = account.id;
    userOp.nonce = Number(nonce);
    userOp.success = success;
    userOp.actualGasCost = Number(actualGasCost);
    userOp.actualGasUsed = Number(actualGasUsed);

    userOp.txHash = transaction.transaction_hash;
    userOp.createdAt = block.block_timestamp;

    if (firstBlood) await IUserOp.save(userOp);
    else await IUserOp.updateOne({ id: userOpHash.toLowerCase() }, userOp);
  } catch (error) {
    console.error(error);
  }
};

const updateBlockchain = async (IBlockchain: Instance) => {
  try {
    let firstBlood = false;
    let blockchain = await IBlockchain.findOne({ id: "ETH" });
    if (!blockchain) {
      blockchain = await IBlockchain.create({ id: "ETH" });
      firstBlood = true;
    }

    blockchain.totalOperations = blockchain.totalOperations || "0";
    blockchain.totalOperations = new BigNumber(blockchain.totalOperations)
      .plus(1)
      .toString();

    if (firstBlood) await IBlockchain.save(blockchain);
    else await IBlockchain.updateOne({ id: blockchain.id }, blockchain);
  } catch (error) {
    console.error(error);
  }
};

const updatePaymaster = async (
  IPaymaster: Instance,
  timestamp: string,
  id: string,
  userOpHash: string
) => {
  try {
    let paymaster = await IPaymaster.findOne({ id: id.toLowerCase() });
    let firstBlood = false;

    if (!paymaster) {
      firstBlood = true;
      paymaster = await IPaymaster.create({ id: id.toLowerCase() });
      paymaster.totalOperations = "0";
      paymaster.createdAt = timestamp;
    }

    paymaster.ops.push(userOpHash);
    paymaster.updatedAt = timestamp;
    paymaster.totalOperations = new BigNumber(paymaster.totalOperations)
      .plus(1)
      .toString();

    if (firstBlood) await IPaymaster.save(paymaster);
    else await IPaymaster.updateOne({ id: id.toLowerCase() }, paymaster);
  } catch (error) {
    console.error(error);
  }
};

const updateBundler = async (
  IBundler: Instance,
  timestamp: string,
  id: string,
  userOpHash: string
) => {
  try {
    let bundler = await IBundler.findOne({ id: id.toLowerCase() });
    let firstBlood = false;
    if (!bundler) {
      firstBlood = true;
      bundler = await IBundler.create({ id: id.toLowerCase() });
      bundler.totalOperations = "0";
      bundler.createdAt = timestamp;
    }

    bundler.ops.push(userOpHash);
    bundler.updatedAt = timestamp;
    bundler.totalOperations = new BigNumber(bundler.totalOperations)
      .plus(1)
      .toString();

    if (firstBlood) await IBundler.save(bundler);
    else await IBundler.updateOne({ id: id.toLocaleLowerCase() }, bundler);
  } catch (error) {
    console.error(error);
  }
};
