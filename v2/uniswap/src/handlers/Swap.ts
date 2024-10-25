import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";

import { Instance } from "@blockflow-labs/sdk";

import { ISwap, Swap } from "../types/generated";

/**
 * @dev Event::Swap(address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address to)
 * @param context trigger object with contains {event: {sender ,amount0In ,amount1In ,amount0Out ,amount1Out ,to }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SwapHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Swap here

  const { event, transaction, block, log } = context;
  const { sender, amount0In, amount1In, amount0Out, amount1Out, to } = event;

  const client = Instance.PostgresClient(bind);

  const swapDB = client.db(Swap);

  const entry: ISwap = {
    sender: sender?.toString(),
    amount0In: amount0In?.toString(),
    amount0Out: amount0Out?.toString(),
    amount1In: amount1In?.toString(),
    amount1Out: amount1Out?.toString(),
    to: to?.toString(),
    pair: log.log_address.toString(),
  };

  await swapDB.save(entry);
};
