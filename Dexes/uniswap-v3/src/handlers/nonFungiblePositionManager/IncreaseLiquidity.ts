import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniPosition } from "../../types/schema";
import BigNumber from "bignumber.js";

/**
 * @dev Event::IncreaseLiquidity(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
 * @param context trigger object with contains {event: {tokenId ,liquidity ,amount0 ,amount1 }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const IncreaseLiquidityHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for IncreaseLiquidity here

  const { event, transaction, block, log } = context;
  const { tokenId, liquidity, amount0, amount1 } = event;

  const positionDb = bind(UniPosition);

  const position = await positionDb.findOne({
    id: tokenId._hex,
  });

  if (!position) {
    await positionDb.create({
      id: tokenId._hex,
      tokenId: Number(tokenId),
      owner: transaction.transaction_from_address,
      liquidity: liquidity.toString(),
      approved: null,
      staked: false,
      oldOwner: null,
    });
  } else {
    position.liquidity = new BigNumber(position.liquidity)
      .minus(liquidity.toString())
      .toString();

    await positionDb.save(position);
  }
};
