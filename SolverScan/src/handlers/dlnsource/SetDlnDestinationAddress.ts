import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::SetDlnDestinationAddress(uint256 chainIdTo, bytes dlnDestinationAddress, uint8 chainEngine)
 * @param context trigger object with contains {event: {chainIdTo ,dlnDestinationAddress ,chainEngine }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SetDlnDestinationAddressHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for SetDlnDestinationAddress here

  const { event, transaction, block, log } = context;
  const { chainIdTo, dlnDestinationAddress, chainEngine } = event;
};
