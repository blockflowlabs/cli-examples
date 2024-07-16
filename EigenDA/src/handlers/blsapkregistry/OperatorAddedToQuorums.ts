import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { OperatorAddedToQuorum } from "../../types/schema";
/**
 * @dev Event::OperatorAddedToQuorums(address operator, bytes32 operatorId, bytes quorumNumbers)
 * @param context trigger object with contains {event: {operator ,operatorId ,quorumNumbers }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorAddedToQuorumsHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorAddedToQuorums here

  const { event, transaction, block, log } = context;
  const { operator, operatorId, quorumNumbers } = event;

  const OperatorAddedToQuorumDB : Instance = bind(OperatorAddedToQuorum);
  const Id = `${transaction.transaction_hash}-${log.log_index}`;

  let oatq = await OperatorAddedToQuorumDB.create({
    id: Id,
    operator: operator,
    quorumNumbers: quorumNumbers,
    blockNumber: block.block_number,
    blockTimestamp: block.block_timestamp,
    transactionHash: transaction.transaction_hash
  })
};
