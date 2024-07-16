import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::QuorumIndexUpdate(bytes32 operatorId, uint8 quorumNumber, uint32 newOperatorIndex)
 * @param context trigger object with contains {event: {operatorId ,quorumNumber ,newOperatorIndex }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const QuorumIndexUpdateHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for QuorumIndexUpdate here

  const { event, transaction, block, log } = context;
  const { operatorId, quorumNumber, newOperatorIndex } = event;
};
