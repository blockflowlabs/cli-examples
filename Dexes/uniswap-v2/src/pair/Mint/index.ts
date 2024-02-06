import { IEventContext, IBind } from "@blockflow-labs/utils";

/**
 * @dev Event::Mint(address sender, uint256 amount0, uint256 amount1)
 * @param context trigger object with contains {event: {sender ,amount0 ,amount1 }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const MintHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Mint here

  const { event, transaction, block, log } = context;
  const { sender, amount0, amount1 } = event;
};
