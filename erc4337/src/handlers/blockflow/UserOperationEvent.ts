import { UserOp } from "../../types/schema";

/**
 * @dev Event::UserOperationEvent(bytes32 userOpHash, address sender, address paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)
 * @param context trigger object with contains {event: {userOpHash ,sender ,paymaster ,nonce ,success ,actualGasCost ,actualGasUsed }, transaction, block, log}
 */
export const UserOperationEventHandler = async (
  context: any,
  load: any,
  save: any
) => {
  // Implement your event handler logic for UserOperationEvent here
  const userOpHash = context.payload.userOpHash;
  const userOp = await UserOp.load(userOpHash, load);

  userOp.success = context.payload.success;
  userOp.actualGasCost = context.payload.actualGasCost;
  userOp.actualGasUsed = context.payload.actualGasUsed;

  await UserOp.save(userOp, save);
};
