import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { TradeData, SolverData } from "../../types/schema";
import {
  COW_PROTOCOL_TOPIC0,
  COW_PROTOCOL_ADDRESS,
  SETTLEMENT_LOG_TOPIC,
} from "../../utils/utils";

/**
 * @dev Event::Trade(address owner, address sellToken, address buyToken, uint256 sellAmount, uint256 buyAmount, uint256 feeAmount, bytes orderUid)
 * @param context trigger object with contains {event: {owner ,sellToken ,buyToken ,sellAmount ,buyAmount ,feeAmount ,orderUid }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TradeHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Trade here

  const { event, transaction, block, log } = context;
  const {
    owner,
    sellToken,
    buyToken,
    sellAmount,
    buyAmount,
    feeAmount,
    orderUid,
  } = event;

  const tradeDataDB: Instance = bind(TradeData);
  const solverDataDB: Instance = bind(SolverData);

  const solver = transaction.logs
    ? transaction.logs.find(
        (log) =>
          log.topics[0].toLowerCase() === SETTLEMENT_LOG_TOPIC.toLowerCase(),
      )
    : null;
  const solverAddress = solver?.topics[1].toLowerCase();

  let tradedata = await tradeDataDB.create({
    id: transaction.transaction_hash,
    protocolAddress: COW_PROTOCOL_ADDRESS,
    owner: owner,
    sellToken: sellToken,
    buyToken: buyToken,
    sellAmount: sellAmount,
    buyAmount: buyAmount,
    solver: solverAddress,
    feeAmount: feeAmount,
    orderUid: orderUid,
    timeStamp: block.block_timestamp,
    transactionHash: transaction.transaction_hash,
    gasUsed: transaction.transaction_gas,
    gasCost: transaction.transaction_gas_price,
  });

  let solverData = await solverDataDB.findOne({
    id: solverAddress,
  });
  if (!solverData) {
    solverData = await solverDataDB.create({
      id: solverAddress,
      solverAddress: solverAddress,
      totalTransactions: 1,
      totalVolume: buyAmount,
      averageVolume: buyAmount,
      totalGasUsed: transaction.transaction_gas,
    });
  } else {
    solverData.totalTransactions += 1;
    solverData.totalVolume += buyAmount;
    solverData.averageVolume =
      solverData.totalVolume / solverData.totalTransactions;
    solverData.totalGasUsed += transaction.transaction_gas;
    await solverDataDB.save(solverData);
  }
};
