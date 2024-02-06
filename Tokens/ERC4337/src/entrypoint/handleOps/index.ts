import { IFunctionContext, Instance } from "@blockflow-labs/utils";

import getUserOpHash from "../../utils/helpers";
import { UserOperation, Block, Transaction } from "../../types/schema";

const CHAIN_ID = "1";
/**
 * @dev Function::handleOps(tuple[] ops, address beneficiary)
 * @param context trigger object with contains {function: {ops ,beneficiary }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const handleOps = async (context: IFunctionContext, bind: Function) => {
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
    transactionHash,
  );

  // transaction
  const ITransaction = bind(Transaction);
  let firstBlood = false;
  let Xtransaction = await ITransaction.findOne({
    id: transactionHash.toLowerCase(),
  });

  if (!Xtransaction) {
    firstBlood = true;
    Xtransaction = await ITransaction.create({
      id: transactionHash.toLowerCase(),
    });
  }

  Xtransaction.transactionHash = transactionHash;

  // updating userOps
  const entryPoint = transaction.transaction_to_address;

  for (const op of ops) {
    const userOpHash = getUserOpHash(op, entryPoint, CHAIN_ID);
    Xtransaction.userOpHashes.push(userOpHash);

    const IUserOp = bind(UserOperation);
    let userOp = await IUserOp.findOne({ id: userOpHash.toLowerCase() });
    if (!userOp) {
      userOp = await IUserOp.create({ id: userOpHash.toLowerCase() });
    }

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

    if (firstBlood) await IUserOp.save(userOp);
    else await IUserOp.updateOne({ id: userOpHash.toLowerCase() }, userOp);
  }

  if (firstBlood) await ITransaction.save(Xtransaction);
  else
    await ITransaction.updateOne(
      { id: transactionHash.toLowerCase() },
      Xtransaction,
    );
};

const updateBlock = async (
  IBlock: Instance,
  id: string,
  transactionHash: string,
) => {
  let firstBlood = false;
  let Xblock = await IBlock.findOne({ id });
  if (!Xblock) {
    firstBlood = true;
    Xblock = await IBlock.create({ id });
  }

  Xblock.transactionHashesWithUserOps.push(transactionHash);

  if (firstBlood) await IBlock.save(Xblock);
  else await IBlock.updateOne({ id }, Xblock);
};
