import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { OperatorRemovedFromQuorum } from "../../types/schema";

/**
 * @dev Event::OperatorRemovedFromQuorums(address operator, bytes32 operatorId, bytes quorumNumbers)
 * @param context trigger object with contains {event: {operator ,operatorId ,quorumNumbers }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorRemovedFromQuorumsHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorRemovedFromQuorums here

  const { event, transaction, block, log } = context;
  const { operator, operatorId, quorumNumbers } = event;

  const OperatorRemovedFromQuorumDB: Instance = bind(OperatorRemovedFromQuorum);
  const Id = `${transaction.transaction_hash}-${log.log_index}`;

  let orfq = await OperatorRemovedFromQuorumDB.create({
    id: Id,
    operator: operator,
    quorumNumbers: quorumNumbers,
    blockNumber: block.block_number,
    blockTimestamp: block.block_timestamp,
    transactionHash: transaction.transaction_hash
  })
};
