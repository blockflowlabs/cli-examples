import { IEventContext } from "@blockflow-labs/utils";

/**
 * @dev Event::AddressChanged(bytes32 node, uint256 coinType, bytes newAddress)
 * @param context trigger object with contains {event: {node ,coinType ,newAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AddressChangedHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for AddressChanged here

  const { event, transaction, block, log } = context;
  const { node, coinType, newAddress } = event;
};
