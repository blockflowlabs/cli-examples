import { BigNumber } from "bignumber.js";
import {
  IEventContext,
  IBind,
  Instance,
  ITransaction,
} from "@blockflow-labs/utils";

import {
  UserOperation,
  Bundler,
  Account,
  Paymaster,
  Blockchain,
  IUserOperation,
  IAccount,
  IPaymaster,
  IBundler,
  IBlockchain,
  UserOpLogs,
  IUserOpLogs,
} from "../../types/schema";

import { USER_OP_EVENT_TRANSFER_TOPIC0 } from "../../utils/helpers";
import { getNumber } from "ethers";
/**
 * @dev Event::UserOperationEvent(bytes32 userOpHash, address sender, address paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)
 * @param context trigger object with contains {event: {userOpHash ,sender ,paymaster ,nonce ,success ,actualGasCost ,actualGasUsed }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserOperationEventHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any,
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

    let target = transaction.transaction_to_address;
    let fee =
      parseInt(transaction.transaction_gas_price) *
      parseInt(transaction.transaction_receipt_gas_used);

    await updateUserLogsDB(
      bind(UserOpLogs),
      transaction.transaction_hash,
      transaction,
    );
    await updateBlockchain(bind(Blockchain));
    await updatePaymaster(
      bind(Paymaster),
      block.block_timestamp,
      paymaster,
      userOpHash,
      actualGasUsed,
    );
    await updateBundler(
      bind(Bundler),
      block.block_timestamp,
      transaction.transaction_from_address,
      userOpHash,
      actualGasUsed,
      sender,
      target,
      fee.toString(),
    );

    const useropevents = transaction.logs
      ? transaction.logs.filter(
          (log) =>
            log.topics[0].toLowerCase() ===
            USER_OP_EVENT_TRANSFER_TOPIC0.toLowerCase(),
        )
      : [];

    const ERC20Data = useropevents.map((useropevent) => {
      const ERC20TransferAmount =
        parseInt(useropevent?.log_data || "").toString() || "";
      const ERC20TransferFromAddress = useropevent?.topics[1] || "";
      const ERC20TransferToAddress = useropevent?.topics[2] || "";

      return {
        ERC20TransferAmount,
        ERC20TransferFrom: ERC20TransferFromAddress,
        ERC20TransferTo: ERC20TransferToAddress,
      };
    });

    const ERC20DataJSON = JSON.stringify(ERC20Data);

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
    userOp.ERC20Data = ERC20DataJSON;

    await userOpDB.save(userOp);
  } catch (error) {
    console.error(error);
  }
};

const updateBlockchain = async (blockchainDB: Instance) => {
  try {
    let blockchain: IBlockchain = await blockchainDB.findOne({ id: "ETH" });
    blockchain ??= await blockchainDB.create({
      id: "ETH",
      totalOperations: "0",
      totalAccount: "0",
    });

    blockchain.totalOperations = new BigNumber(
      blockchain.totalOperations.toString(),
    )
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
  paymaster: string,
  userOpHash: string,
  actualGasUsed: string,
) => {
  try {
    let $paymaster: IPaymaster = await paymasterDB.findOne({
      id: paymaster.toLowerCase(),
    });
    $paymaster ??= await paymasterDB.create({
      id: paymaster.toLowerCase(),
      totalOperations: "0",
      createdAt: timestamp,
      gasSponsored: actualGasUsed,
    });

    $paymaster.ops.push(userOpHash);
    $paymaster.updatedAt = timestamp;
    $paymaster.totalOperations = new BigNumber(
      $paymaster.totalOperations.toString(),
    )
      .plus(1)
      .toString();
    $paymaster.gasSponsored += actualGasUsed;

    await paymasterDB.save($paymaster);
  } catch (error) {
    console.error(error);
  }
};

const updateBundler = async (
  bundlerDB: Instance,
  timestamp: string,
  bundler: string,
  userOpHash: string,
  gasCollected: string,
  sender: string,
  target: string,
  fee: string,
) => {
  try {
    let $bundler: IBundler = await bundlerDB.findOne({
      id: bundler.toLowerCase(),
    });

    $bundler ??= await bundlerDB.create({
      id: bundler.toLowerCase(),
      totalOperations: "0",
      createdAt: timestamp,
      gasCollected: gasCollected,
      sender: sender,
      target: target,
      fee: fee,
    });

    $bundler.ops.push(userOpHash);
    $bundler.updatedAt = timestamp;
    $bundler.totalOperations = new BigNumber(
      $bundler.totalOperations.toString(),
    )
      .plus(1)
      .toString();
    $bundler.gasCollected += gasCollected;
    $bundler.fee = fee;
    $bundler.sender = sender;
    $bundler.target = target;

    await bundlerDB.save($bundler);
  } catch (error) {
    console.error(error);
  }
};

const updateUserLogsDB = async (
  UserOpLogsDB: Instance,
  transactionHash: string,
  transaction: any,
) => {
  const log_data: String[] = []; //array for each log index
  transaction.logs.map((log_address: any) => {
    log_data.push(JSON.stringify(log_address)); //data for each log in the same aaray entry
  });

  try {
    let $userlogs: IUserOpLogs = await UserOpLogsDB.findOne({
      id: transactionHash,
    });
    function getNumberOfLogs(transaction: any) {
      if (transaction.logs && Array.isArray(transaction.logs)) {
        return transaction.logs.length;
      } else {
        return 0;
      }
    }
    $userlogs ??= await UserOpLogsDB.create({
      id: transactionHash,
      numberOfLogs: getNumberOfLogs(transaction),
      JSONdata: log_data,
    });
    await UserOpLogsDB.save($userlogs);
  } catch (error) {
    console.log(error);
  }
};
