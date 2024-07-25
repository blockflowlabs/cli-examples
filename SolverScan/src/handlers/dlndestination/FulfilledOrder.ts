import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { BridgeData } from "../../types/schema";

/**
 * @dev Event::FulfilledOrder(tuple order, bytes32 orderId, address sender, address unlockAuthority)
 * @param context trigger object with contains {event: {order ,orderId ,sender ,unlockAuthority }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FulfilledOrderHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for FulfilledOrder here

  const { event, transaction, block, log } = context;
  const { order, orderId, sender, unlockAuthority } = event;
  
  const bridgeDataDB: Instance = bind(BridgeData);

  let bridgedata = await bridgeDataDB.create({
   id: orderId,
   transactionHashSrc:"",
   transactionHashDest: transaction.transaction_hash,
   from:"",
   fromValue:"",
   to: log.log_address,
   toValue: "",
   solver:"",
   solverGasCost: "",
   timestampSrc:"",
   timestampDest: block.block_timestamp,
   bridgeTime: ""
  });

};
