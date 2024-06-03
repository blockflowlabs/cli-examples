import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::MinterUpdated(address newMinter, address oldMinter)
 * @param context trigger object with contains {event: {newMinter ,oldMinter }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MinterUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for MinterUpdated here

  const { event, transaction, block, log } = context;
  const { newMinter, oldMinter } = event;
};
