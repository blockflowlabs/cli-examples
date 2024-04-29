import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ISharesBurn, SharesBurn } from "../../../types/schema";
import { _loadSharesBurnEntity } from "../../../helpers";

/**
 * @dev Event::SharesBurnt(address account, uint256 preRebaseTokenAmount, uint256 postRebaseTokenAmount, uint256 sharesAmount)
 * @param context trigger object with contains {event: {account ,preRebaseTokenAmount ,postRebaseTokenAmount ,sharesAmount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SharesBurntHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for SharesBurnt here

  const { event, transaction, block, log } = context;
  const { account, preRebaseTokenAmount, postRebaseTokenAmount, sharesAmount } =
    event;

  const sharesBurnDB: Instance = bind(SharesBurn);

  const sharesBurn: ISharesBurn = await _loadSharesBurnEntity(
    sharesBurnDB,
    context
  );

  await sharesBurnDB.save(sharesBurn);
};
