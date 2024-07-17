import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::ChurnApproverUpdated(address prevChurnApprover, address newChurnApprover)
 * @param context trigger object with contains {event: {prevChurnApprover ,newChurnApprover }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ChurnApproverUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ChurnApproverUpdated here

  const { event, transaction, block, log } = context;
  const { prevChurnApprover, newChurnApprover } = event;
};
