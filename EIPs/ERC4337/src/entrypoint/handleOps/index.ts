import { IFunctionContext, Instance, IBind } from "@blockflow-labs/utils";

import getUserOpHash from "../../utils/helpers";
import { UserOperation, Block, Transaction } from "../../types/schema";

const CHAIN_ID = "1";
/**
 * @dev Function::handleOps(tuple[] ops, address beneficiary)
 * @param context trigger object with contains {function: {ops ,beneficiary }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const handleOps = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: any
) => {
  // Implement your function handler logic for handleOps here

  const { functionParams, transaction, block } = context;
  let { ops, beneficiary } = functionParams;

  beneficiary = beneficiary.toString();

  // Implement your function handler logic for handleOps here
  const transactionHash = context.transaction.transaction_hash;

  // block
  await updateBlock(
    bind(Block),
    block.block_number.toString(),
    transactionHash
  );

  // transaction
  const transactionDB = bind(Transaction);
  let transaction_ = await transactionDB.findOne({
    id: transactionHash.toLowerCase(),
  });

  transaction_ ??= await transactionDB.create({
    id: transactionHash.toLowerCase(),
  });

  transaction_.transactionHash = transactionHash;

  // updating userOps
  const entryPoint = transaction.transaction_to_address;

  for (const op of ops) {
    const userOpHash = getUserOpHash(op, entryPoint, CHAIN_ID);
    transaction_.userOpHashes.push(userOpHash);

    const userOpDB = bind(UserOperation);
    let userOp = await userOpDB.findOne({ id: userOpHash.toLowerCase() });
    userOp ??= await userOpDB.create({ id: userOpHash.toLowerCase() });

    userOp.sender = op.sender;
    userOp.nonce = op.nonce;
    userOp.initCode = op.initCode;
    userOp.callData = op.callData;
    userOp.callGasLimit = op.callGasLimitring;
    userOp.verificationGasLimit = op.verificationGasLimit;
    userOp.preVerificationGas = op.preVerificationGas;
    userOp.maxFeePerGas = op.maxFeePerGas;
    userOp.maxPriorityFeePerGas = op.maxPriorityFeePerGas;
    userOp.paymasterAndData = op.paymasterAndData;
    userOp.signature = op.signature;
    userOp.beneficiary = beneficiary;

    await userOpDB.save(userOp);
  }

  await transactionDB.save(transaction_);
};

const updateBlock = async (
  blockDB: Instance,
  id: string,
  transactionHash: string
) => {
  let block = await blockDB.findOne({ id });
  block ??= await blockDB.create({ id });

  block.transactionHashesWithUserOps.push(transactionHash);
  await blockDB.save(block);
};
