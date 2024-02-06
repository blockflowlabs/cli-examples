import { IEventContext, IBind } from "@blockflow-labs/utils";

/**
 * @dev Event::Burn(address sender, uint256 amount0, uint256 amount1, address to)
 * @param context trigger object with contains {event: {sender ,amount0 ,amount1 ,to }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const BurnHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Burn here

  const { event, transaction, block, log } = context;
  const { sender, amount0, amount1, to } = event;
};
