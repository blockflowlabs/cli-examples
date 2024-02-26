import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  IUserOperationRevertReason,
  UserOperationRevertReason,
} from "../../types/schema";

/**
 * @dev Event::UserOperationRevertReason(bytes32 userOpHash, address sender, uint256 nonce, bytes revertReason)
 * @param context trigger object with contains {event: {userOpHash ,sender ,nonce ,revertReason }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserOperationRevertReasonHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: any
) => {
  try {
    // Implement your event handler logic for UserOperationRevertReason here
    const { event, transaction, block, log } = context;
    let { userOpHash, sender, nonce, revertReason } = event;

    userOpHash = userOpHash.toString();
    sender = sender.toString();
    nonce = nonce.toString();

    const revertDB: Instance = bind(UserOperationRevertReason);
    let revert: IUserOperationRevertReason = await revertDB.findOne({
      id: userOpHash.toLowercase(),
    });
    revert ??= await revertDB.create({
      id: userOpHash.toLowercase(),
      sender: sender,
      nonce: parseInt(nonce),
      reason: revertReason,
      block: block.block_number,
      txHash: transaction.transaction_hash,
      createdAt: block.block_timestamp,
    });
  } catch (error) {
    console.error(error);
  }
};
