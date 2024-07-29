import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {BridgeDataSrc} from "../../types/schema"

/**
 * @dev Event::V3FundsDeposited(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 destinationChainId, uint32 depositId, uint32 quoteTimestamp, uint32 fillDeadline, uint32 exclusivityDeadline, address depositor, address recipient, address exclusiveRelayer, bytes message)
 * @param context trigger object with contains {event: {inputToken ,outputToken ,inputAmount ,outputAmount ,destinationChainId ,depositId ,quoteTimestamp ,fillDeadline ,exclusivityDeadline ,depositor ,recipient ,exclusiveRelayer ,message }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const V3FundsDepositedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for V3FundsDeposited here

  const { event, transaction, block, log } = context;
  const {
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    destinationChainId,
    depositId,
    quoteTimestamp,
    fillDeadline,
    exclusivityDeadline,
    depositor,
    recipient,
    exclusiveRelayer,
    message,
  } = event;
  const bridgeDataSrcDB: Instance = bind(BridgeDataSrc);

  let bridgedata = await bridgeDataSrcDB.findOne({
    id:depositId.toString()
  })
  if(!bridgedata){
    await bridgeDataSrcDB.create({
      id: depositId.toString(),
      transactionHashSrc: transaction.transaction_hash,
      from: inputToken,
      fromValue: inputAmount.toString(),
      timestampSrc: block.block_timestamp.toString(),
    })
  }
};
