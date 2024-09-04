import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniPosition } from "../../types/schema";

/**
 * @dev Event::Approval(address owner, address approved, uint256 tokenId)
 * @param context trigger object with contains {event: {owner ,approved ,tokenId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ApprovalHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Approval here

  const { event, transaction, block, log } = context;
  const { owner, approved, tokenId } = event;

  const positionDb = bind(UniPosition);

  const position = await positionDb.findOne({ id: tokenId._hex });

  if (position) {
    position.approved = approved;

    await positionDb.save(position);
  }
};
