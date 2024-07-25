import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::SetDlnSourceAddress(uint256 chainIdFrom, bytes dlnSourceAddress, uint8 chainEngine)
 * @param context trigger object with contains {event: {chainIdFrom ,dlnSourceAddress ,chainEngine }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SetDlnSourceAddressHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for SetDlnSourceAddress here

  const { event, transaction, block, log } = context;
  const { chainIdFrom, dlnSourceAddress, chainEngine } = event;
};
