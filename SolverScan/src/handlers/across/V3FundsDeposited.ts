import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {BridgeData} from "../../types/schema"

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
  const bridgeDataDB: Instance = bind(BridgeData);

  let bridgedata = await bridgeDataDB.findOne({
    id:depositId.toString()
  })
  if(!bridgedata){
    await bridgeDataDB.create({
      id: depositId.toString(),
      transactionHashSrc: transaction.transaction_hash,
      transactionHashDest: "",
      from: inputToken,
      fromValue: inputAmount.toString(),
      to: outputToken,
      toValue: outputAmount.toString(),
      solver: "",
      solverGasCost: "",
      timestampSrc: block.block_timestamp.toString(),
      timestampDest: "",
    })
  }
  else{
    bridgedata.transactionHashSrc = transaction.transaction_hash;
    bridgedata.from = inputToken;
    bridgedata.fromValue = inputAmount.toString();
    bridgedata.to = outputToken;
    bridgedata.toValue = outputAmount.toString();
    bridgedata.timestampSrc = block.block_timestamp.toString();
    
    await bridgeDataDB.save(bridgedata);
  }
};
