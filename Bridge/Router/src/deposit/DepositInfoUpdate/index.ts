import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import { chainToContract } from "../../utils/helper";
import { DepositInfoUpdate as infoUpdate } from "../../types/schema";

/**
 * @dev Event::DepositInfoUpdate(address srcToken, uint256 feeAmount, uint256 depositId, uint256 eventNonce, bool initiatewithdrawal, address depositor)
 * @param context trigger object with contains {event: {srcToken ,feeAmount ,depositId ,eventNonce ,initiatewithdrawal ,depositor }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositInfoUpdate = async (
  context: IEventContext,
  bind: IBind,
  secrets: Record<string, string>
) => {
  // Implement your event handler logic for DepositInfoUpdate here
  const { event, transaction, block } = context;
  let {
    srcToken,
    feeAmount,
    depositId,
    eventNonce,
    initiatewithdrawal,
    depositor,
  } = event;

  srcToken = srcToken.toString();
  feeAmount = feeAmount.toString();
  depositId = depositId.toString();
  eventNonce = eventNonce.toString();
  depositor = depositor.toString();

  const infoDB: Instance = bind(infoUpdate);
  const srcChain = block.chain_id;

  await infoDB.create({
    id: `${depositId}_${chainToContract(srcChain)}`.toLowerCase(),
    updateId: eventNonce,
    isWithdraw: initiatewithdrawal,
    transactionHash: transaction.transaction_hash,
  });
};
