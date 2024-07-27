import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { BridgeData } from "../../types/schema";
/**
 * @dev Event::CreatedOrder(tuple order, bytes32 orderId, bytes affiliateFee, uint256 nativeFixFee, uint256 percentFee, uint32 referralCode, bytes metadata)
 * @param context trigger object with contains {event: {order ,orderId ,affiliateFee ,nativeFixFee ,percentFee ,referralCode ,metadata }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const CreatedOrderHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for CreatedOrder here

  const { event, transaction, block, log } = context;
  const {
    order,
    orderId,
    affiliateFee,
    nativeFixFee,
    percentFee,
    referralCode,
    metadata,
  } = event;

  const value =
    parseInt(transaction.transaction_value) -
    affiliateFee -
    nativeFixFee -
    percentFee;

  const bridgeDataDB: Instance = bind(BridgeData);

  let bridgedata = await bridgeDataDB.findOne({
    id: orderId,
  });
  if(!bridgedata){
  await bridgeDataDB.create({
    id: orderId,
    transactionHashSrc: transaction.transaction_hash,
    transactionHashDest: "",
    from: log.log_address,
    fromValue: value,
    to: "",
    toValue: "",
    solver: "",
    solverGasCost: "",
    timestampSrc: block.block_timestamp,
    timestampDest: "",
    bridgeTime: "",
  });}
  else{
    bridgedata.transactionHashSrc = transaction.transaction_hash;
    bridgedata.from = log.log_address;
    bridgedata.fromValue = value;
    bridgedata.timestampSrc = block.block_timestamp;
    await bridgeDataDB.save(bridgedata);
  }
};

