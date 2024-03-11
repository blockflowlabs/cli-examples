import { BigNumber } from "bignumber.js";
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  UserOperation,
  Bundler,
  Account,
  Paymaster,
  Blockchain,
  IUserOperation,
  IAccount,
} from "../../types/schema";

/**
 * @dev Event::UserOperationEvent(bytes32 userOpHash, address sender, address paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)
 * @param context trigger object with contains {event: {userOpHash ,sender ,paymaster ,nonce ,success ,actualGasCost ,actualGasUsed }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserOperationEventHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
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

    const accountDB = bind(Account);
    let account: IAccount = await accountDB.findOne({
      id: sender.toLowerCase(),
    });
    account ??= await accountDB.create({
      id: sender.toLowerCase(),
      totalOperations: "0",
      createdOpHash: userOpHash,
      paymaster: paymaster.toLowerCase(),
      createdAt: block.block_timestamp,
      createdHash: transaction.transaction_hash,
    });

    account.ops.push(userOpHash);
    account.totalOperations = new BigNumber(account.totalOperations.toString())
      .plus(1)
      .toString();
    account.updatedAt = block.block_timestamp;

    await accountDB.save(account);

    const userOpDB = bind(UserOperation);
    let userOp: IUserOperation = await userOpDB.findOne({
      id: userOpHash.toLowerCase(),
    });
    userOp ??= await userOpDB.create({ id: userOpHash.toLowerCase() });

    userOp.bundler = transaction.transaction_from_address.toLowerCase();
    userOp.paymaster = paymaster.toLowerCase();
    userOp.sender = account.id;
    userOp.nonce = Number(nonce);
    userOp.success = success;
    userOp.actualGasCost = Number(actualGasCost);
    userOp.actualGasUsed = Number(actualGasUsed);
    userOp.txHash = transaction.transaction_hash;
    userOp.createdAt = block.block_timestamp;
    userOp.entryPoint = transaction.transaction_to_address;
    userOp.network = "mainnet";

    await userOpDB.save(userOp);
  } catch (error) {
    console.error(error);
  }
};

const updateBlockchain = async (blockchainDB: Instance) => {
  try {
    let blockchain = await blockchainDB.findOne({ id: "ETH" });
    blockchain ??= await blockchainDB.create({ id: "ETH" });

    blockchain.totalOperations = blockchain.totalOperations || "0";
    blockchain.totalOperations = new BigNumber(blockchain.totalOperations)
      .plus(1)
      .toString();

    await blockchainDB.save(blockchain);
  } catch (error) {
    console.error(error);
  }
};

const updatePaymaster = async (
  paymasterDB: Instance,
  timestamp: string,
  id: string,
  userOpHash: string
) => {
  try {
    let paymaster = await paymasterDB.findOne({ id: id.toLowerCase() });
    paymaster ??= await paymasterDB.create({
      id: id.toLowerCase(),
      totalOperations: "0",
      createdAt: timestamp,
    });

    paymaster.ops.push(userOpHash);
    paymaster.updatedAt = timestamp;
    paymaster.totalOperations = new BigNumber(paymaster.totalOperations)
      .plus(1)
      .toString();

    await paymasterDB.save(paymaster);
  } catch (error) {
    console.error(error);
  }
};

const updateBundler = async (
  bundlerDB: Instance,
  timestamp: string,
  id: string,
  userOpHash: string
) => {
  try {
    let bundler = await bundlerDB.findOne({ id: id.toLowerCase() });
    bundler ??= await bundlerDB.create({
      id: id.toLowerCase(),
      totalOperations: "0",
      createdAt: timestamp,
    });

    bundler.ops.push(userOpHash);
    bundler.updatedAt = timestamp;
    bundler.totalOperations = new BigNumber(bundler.totalOperations)
      .plus(1)
      .toString();

    await bundlerDB.save(bundler);
  } catch (error) {
    console.error(error);
  }
};
