import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::EIP712DomainChanged()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const EIP712DomainChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for EIP712DomainChanged here

  const { event, transaction, block, log } = context;
  const {} = event;
};
