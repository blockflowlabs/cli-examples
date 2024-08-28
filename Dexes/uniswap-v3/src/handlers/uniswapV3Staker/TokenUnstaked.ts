import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniPosition } from "../../types/schema";

/**
 * @dev Event::TokenUnstaked(uint256 tokenId, bytes32 incentiveId)
 * @param context trigger object with contains {event: {tokenId ,incentiveId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TokenUnstakedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for TokenUnstaked here

  const { event, transaction, block, log } = context;
  const { tokenId, incentiveId } = event;

  const positionDb = bind(UniPosition);

  const position = await positionDb.findOne({ id: tokenId._hex });

  if (position) {
    position.staked = false;

    await positionDb.save(position);
  }
};
