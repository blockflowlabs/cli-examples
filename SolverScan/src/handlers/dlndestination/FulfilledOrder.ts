import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { BridgeData, SolverAnalysis } from "../../types/schema";
import { BigNumber } from "bignumber.js";

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

  const { event, transaction, block, log } = context;
  const { order, orderId, sender, unlockAuthority } = event;

  const bridgeDataDB: Instance = bind(BridgeData);
  const solveranalysisDB: Instance = bind(SolverAnalysis);

const gasPrice = new BigNumber(transaction.transaction_gas_price);
const gasUsed = new BigNumber(transaction.transaction_receipt_gas_used);
const etherUnit = new BigNumber('1e18');
const transactionValue = new BigNumber(transaction.transaction_value);

const solverGasCost = gasPrice.multipliedBy(gasUsed).dividedBy(etherUnit);
const value = (transactionValue.minus(solverGasCost)).dividedBy(etherUnit);

  let bridgedata = await bridgeDataDB.findOne({
    id: orderId
});
  if (!bridgedata) {
    await bridgeDataDB.create({
    id: orderId,
    transactionHashSrc: "",
    transactionHashDest: transaction.transaction_hash,
    from: "",
    fromValue: "",
    to: log.log_address,
    toValue: value,
    solver: sender,
    solverGasCost: solverGasCost,
    timestampSrc: "",
    timestampDest: block.block_timestamp,
  });
  }
  else{
    bridgedata.transactionHashDest = transaction.transaction_hash;
    bridgedata.to = log.log_address;
    bridgedata.toValue = value;
    bridgedata.solver = sender;
    bridgedata.solverGasCost = solverGasCost;
    bridgedata.timestampDest = block.block_timestamp;
    await bridgeDataDB.save(bridgedata);
  }
  ;
 
  let solveranalysis = await solveranalysisDB.findOne({
    id: sender,
  });
  if (!solveranalysis) {
    await solveranalysisDB.create({
      id: sender,
      totalTransactions: 1,
      totalVolume: value,
      averageVolume: value,
      totalGasSpent: solverGasCost,
    });
  } else {
    solveranalysis.totalTransactions += 1;
    solveranalysis.totalGasSpent += solverGasCost;
    solveranalysis.totalVolume =  (solveranalysis.totalVolume + value).toString();
    solveranalysis.averageVolume = (parseInt(solveranalysis.totalVolume)/parseInt(solveranalysis.totalTransactions)).toString();

    await solveranalysisDB.save(solveranalysis);
  }
};
