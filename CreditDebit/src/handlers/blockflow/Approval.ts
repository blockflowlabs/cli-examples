import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::Approval(address owner, address spender, uint256 value)
 * @param context trigger object with contains {event: {owner ,spender ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ApprovalHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Approval here

  const { event, transaction, block, log } = context;
  const { owner, spender, value } = event;
};
