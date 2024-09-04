import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniPosition } from "../../types/schema";

/**
 * @dev Event::TokenStaked(uint256 tokenId, bytes32 incentiveId, uint128 liquidity)
 * @param context trigger object with contains {event: {tokenId ,incentiveId ,liquidity }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TokenStakedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for TokenStaked here

  const { event, transaction, block, log } = context;
  const { tokenId, incentiveId, liquidity } = event;

  const positionDb = bind(UniPosition);

  const position = await positionDb.findOne({ id: tokenId._hex });

  if (position) {
    position.staked = true;
    position.liquidity = liquidity.toString();

    await positionDb.save(position);
  }
};
