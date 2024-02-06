import { IEventContext, IBind } from "@blockflow-labs/utils";

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param context trigger object with contains {event: {sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const SwapHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Swap here

  const { event, transaction, block, log } = context;
  const { sender, amount0In, amount1In, amount0Out, amount1Out, to } = event;
};
