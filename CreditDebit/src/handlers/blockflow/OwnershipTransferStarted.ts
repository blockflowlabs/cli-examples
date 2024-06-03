import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::OwnershipTransferStarted(address previousOwner, address newOwner)
 * @param context trigger object with contains {event: {previousOwner ,newOwner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OwnershipTransferStartedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OwnershipTransferStarted here

  const { event, transaction, block, log } = context;
  const { previousOwner, newOwner } = event;
};
