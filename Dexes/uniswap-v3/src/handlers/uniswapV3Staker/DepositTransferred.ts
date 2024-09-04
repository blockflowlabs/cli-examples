import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { UniPosition } from "../../types/schema";
/**
 * @dev Event::DepositTransferred(uint256 tokenId, address oldOwner, address newOwner)
 * @param context trigger object with contains {event: {tokenId ,oldOwner ,newOwner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositTransferredHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for DepositTransferred here

  const { event, transaction, block, log } = context;
  const { tokenId, oldOwner, newOwner } = event;

  const positionDb = bind(UniPosition);

  const position = await positionDb.findOne({ id: tokenId._hex });

  if (position) {
    position.oldOwner = oldOwner;
    position.newOwner = newOwner;

    await positionDb.save(position);
  }
};
