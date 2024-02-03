import { BigNumber } from "bignumber.js";
import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import { UserOperationRevertReason } from "../../types/schema";

/**
 * @dev Event::UserOperationRevertReason(bytes32 userOpHash, address sender, uint256 nonce, bytes revertReason)
 * @param context trigger object with contains {event: {userOpHash ,sender ,nonce ,revertReason }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserOperationRevertReasonHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  try {
    // Implement your event handler logic for UserOperationRevertReason here
    const { event, transaction, block, log } = context;
    let { userOpHash, sender, nonce, revertReason } = event;

    userOpHash = userOpHash.toString();
    sender = sender.toString();
    nonce = nonce.toString();

    const IRevert = bind(UserOperationRevertReason);
    let revert = await IRevert.findOne({ id: userOpHash.toLowercase() });

    if (!revert) {
      revert = await IRevert.create({ id: userOpHash.toLowercase() });

      revert.sender = sender;
      revert.nonce = parseInt(nonce);
      revert.reason = revertReason;

      revert.block = block.block_number;
      revert.txHash = transaction.transaction_hash;
      revert.createdAt = block.block_timestamp;
    }
  } catch (error) {
    console.error(error);
  }
};
