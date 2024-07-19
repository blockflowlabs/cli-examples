import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::QuorumBlockNumberUpdated(uint8 quorumNumber, uint256 blocknumber)
 * @param context trigger object with contains {event: {quorumNumber ,blocknumber }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const QuorumBlockNumberUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for QuorumBlockNumberUpdated here

  const { event, transaction, block, log } = context;
  const { quorumNumber, blocknumber } = event;
};
