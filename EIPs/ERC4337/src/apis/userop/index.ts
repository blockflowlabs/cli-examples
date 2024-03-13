import { ABind } from "@blockflow-labs/utils";

import {
  UserOperation,
  Account,
  AccountFactory,
  UserOperationRevertReason,
  Transaction,
} from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const useropHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here
  let { request, response } = context;

  // request contains query object. To access user query params use
  let { userop } = request.query;
  const IUserOp = bind(UserOperation);
  const IAccount = bind(Account);
  const IAccountFactory = bind(AccountFactory);
  const IrevertReason = bind(UserOperationRevertReason);
  const ITransaction = bind(Transaction);

  const userOp = await IUserOp.findOne({ id: userop.toLowerCase() });
  const account = await IAccount.findOne({
    id: userOp.sender.toLowerCase(),
  });
  const accFac = await IAccountFactory.find({
    id: account.factory.toLowerCase(),
  });

  const tx = await ITransaction.findOne({ id: userOp.txHash.toLowerCase() });

  const revertReason = await IrevertReason.findOne({
    id: userop.toLowerCase(),
  });

  response = {
    transactionHash: userOp.txHash,
    userOpHash: userOp.id,
    verificationGasLimit: userOp.verificationGasLimit,
    target: "",
    accountTarget: {
      account,
      factory: accFac,
    },
    success: userOp.success,
    signature: userOp.signature,
    sender: userOp.sender,
    accountSender: {
      factory: account.factory.toLowerCase(),
    },
    revertReason: !revertReason ? null : revertReason.reason,
    preVerificationGas: userOp.preVerificationGas,
    paymasterAndData: userOp.paymasterAndData,
    paymaster: userOp.paymaster,
    nonce: userOp.nonce,
    network: userOp.network,
    initCode: userOp.initCode,
    maxPriorityFeePerGas: userOp.maxPriorityFeePerGas,
    maxFeePerGas: userOp.maxFeePerGas,
    input: userOp.callData,
    gasPrice: tx.gasPrice,
    id: userOp.id,
    gasLimit: tx.gasLimit,
    factory: account.factory.toLowerCase(),
    callGasLimit: userOp.callGasLimit,
    callData: userOp.callData,
    blockTime: userOp.createdAt,
    blockNumber: userOp.block,
    accountGasLimits: null,
    gasFees: null,
    paymasterRevertReason: null,
    beneficiary: userOp.beneficiary,
    // baseFeePerGas: "to be indexed",
    actualGasUsed: userOp.actualGasUsed,
    actualGasCost: userOp.actualGasCost,
    entryPoint: userOp.entryPoint,
  };

  return response;
};
