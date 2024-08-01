import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import { chainToContract, EventNameEnum } from "../../utils/helper";
import { DepositInfoUpdate as infoUpdate, Source } from "../../types/schema";
import { fetchTokenDetails } from "../../utils/token";
import { formatDecimals } from "../../utils/formatting";

/**
 * @dev Event::DepositInfoUpdate(address srcToken, uint256 feeAmount, uint256 depositId, uint256 eventNonce, bool initiatewithdrawal, address depositor)
 * @param context trigger object with contains {event: {srcToken ,feeAmount ,depositId ,eventNonce ,initiatewithdrawal ,depositor }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositInfoUpdate = async (
  context: IEventContext,
  bind: IBind,
  secrets: Record<string, string>,
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

  const feeToken = await fetchTokenDetails(bind, srcChain, srcToken);
  const id =
    `${srcChain}_${transaction.transaction_hash}_${eventNonce}`.toLowerCase();
  const updateObj: any = {
    id,
    srcChainId: srcChain,
    depositId: depositId,
    updateId: eventNonce,
    isWithdraw: initiatewithdrawal,
    feeAmount: formatDecimals(feeAmount, feeToken.decimals),
    eventName: EventNameEnum.DepositInfoUpdate,
    transactionHash: transaction.transaction_hash,
  };
  const sourceDB: Instance = bind(Source);
  const srcRecord: any = await sourceDB.findOne({
    depositId: depositId,
    srcChainId: srcChain,
  });
  if (srcRecord) {
    updateObj["srcRef"] = { recordRef: srcRecord._id };
  }
  await infoDB.create(updateObj);

  if (srcRecord) {
    const savedDest = await updateObj.findOne({
      id,
    });
    srcRecord["withdrawRef"] = { recordRef: savedDest._id };
    await sourceDB.save(srcRecord);
  }
};
