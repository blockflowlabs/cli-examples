import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::QuorumCreated(uint8 quorumNumber)
 * @param context trigger object with contains {event: {quorumNumber }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const QuorumCreatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for QuorumCreated here

  const { event, transaction, block, log } = context;
  const { quorumNumber } = event;
};
