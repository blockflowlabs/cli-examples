import { UserOp, Transaction, Block } from "../../types/schema";
import getUserOpHash from "./helpers";

const chainId = '1';
/**
 * @dev Function::handleOps(tuple[] ops, address beneficiary)
 * @param context trigger object with contains {function: {ops ,beneficiary }, transaction, block, log}
 */
export const handleOpsHandler = async (context: any, load: any, save: any) => {
  // Implement your function handler logic for handleOps here
  const transactionHash = context.transaction.transaction_hash;
  const blockNumber = context.block.block_number;
  const blockTimeStamp = context.block.block_timestamp;

  // block 
  const block = await Block.load(blockNumber, load);
  block.blockNumber = blockNumber;
  block.transactionHashesWithUserOps = [...block.transactionHashesWithUserOps, transactionHash];
  await Block.save(block, save);
  
  // transaction
  const transaction = await Transaction.load(transactionHash, load);
  transaction.transactionHash = transactionHash;
  let userOpHashes = transaction.userOpHashes;

  // updating userOps
  const entryPoint = context.transaction.transaction_to_address;

  for (const op of context.payload.ops) {
    const userOpHash = getUserOpHash(op, entryPoint, chainId);
    userOpHashes = [...userOpHashes, userOpHash];

    const userOp = await UserOp.load(userOpHash, load);
    userOp.userOpHash = userOpHash;
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
    userOp.beneficiary = context.payload.beneficiary;

    userOp.transactionHash = transactionHash;
    userOp.blockNumber = blockNumber;
    userOp.blockTimeStamp = blockTimeStamp
    userOp.entryPoint = entryPoint;

    await UserOp.save(userOp, save);
  }

  transaction.userOpHashes = userOpHashes;
  await Transaction.save(transaction, save);
};
