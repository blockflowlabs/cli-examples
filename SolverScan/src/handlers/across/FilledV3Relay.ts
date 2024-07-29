import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {BridgeData, SolverAnalysis} from "../../types/schema";
import { BigNumber } from "bignumber.js";

/**
 * @dev Event::FilledV3Relay(address inputToken, address outputToken, uint256 inputAmount, uint256 outputAmount, uint256 repaymentChainId, uint256 originChainId, uint32 depositId, uint32 fillDeadline, uint32 exclusivityDeadline, address exclusiveRelayer, address relayer, address depositor, address recipient, bytes message, tuple relayExecutionInfo)
 * @param context trigger object with contains {event: {inputToken ,outputToken ,inputAmount ,outputAmount ,repaymentChainId ,originChainId ,depositId ,fillDeadline ,exclusivityDeadline ,exclusiveRelayer ,relayer ,depositor ,recipient ,message ,relayExecutionInfo }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FilledV3RelayHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for FilledV3Relay here

  const { event, transaction, block, log } = context;
  const {
    inputToken,
    outputToken,
    inputAmount,
    outputAmount,
    repaymentChainId,
    originChainId,
    depositId,
    fillDeadline,
    exclusivityDeadline,
    exclusiveRelayer,
    relayer,
    depositor,
    recipient,
    message,
    relayExecutionInfo,
  } = event;

  const bridgeDataDB: Instance = bind(BridgeData);
  const solveranalysisDB: Instance = bind(SolverAnalysis);

  const gasPrice = new BigNumber(transaction.transaction_gas_price);
  const gasUsed = new BigNumber(transaction.transaction_receipt_gas_used);
  const etherUnit = new BigNumber('1e18');

  const solverGasCost = gasPrice.multipliedBy(gasUsed).dividedBy(etherUnit);

  let bridgedata = await bridgeDataDB.findOne({
    id:depositId
  });
  if(!bridgedata){
    await bridgeDataDB.create({
      id: depositId,
      transactionHashDest: transaction.transaction_hash,
      solver: relayer,
      solverGasCost: solverGasCost ,
      timestampDest: block.block_timestamp.toString(),
    });
  }
  else{
    bridgedata.transactionHashDest = transaction.transaction_hash;
    bridgedata.solver = relayer;
    bridgedata.solverGasCost = parseInt(bridgedata.solverGasCost) + solverGasCost.toNumber();
    bridgedata.timestampDest = block.block_timestamp.toString();

    await bridgeDataDB.save(bridgedata);
  }

  let solverdata = await solveranalysisDB.findOne({
    id: relayer
  });
  if(!solverdata){
    await solveranalysisDB.create({
      id: relayer,
      totalTransactions: "1",
      totalVolume: outputAmount.toString(),
      averageVolume: outputAmount.toString(),
      totalGasSpent: solverGasCost.toString(),
    });
  }
  else{
    solverdata.totalTransactions+= 1;
    solverdata.totalVolume = (parseInt(solverdata.totalVolume) + parseInt(outputAmount)).toString();
    solverdata.averageVolume = (parseInt(solverdata.totalVolume) / parseInt(solverdata.totalTransactions)).toString();
    solverdata.totalGasSpent = parseInt(solverdata.totalGasSpent) + solverGasCost.toNumber();

    await solveranalysisDB.save(solverdata);
  }
};
