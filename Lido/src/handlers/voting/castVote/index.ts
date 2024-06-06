import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVote, Vote } from "../../../types/schema";

/**
 * @dev Event::CastVote(uint256 voteId, address voter, bool supports, uint256 stake)
 * @param context trigger object with contains {event: {voteId ,voter ,supports ,stake }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const CastVoteHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for CastVote here

  const { event, transaction, block, log } = context;
  const { voteId, voter, supports, stake } = event;

  const voteDB: Instance = bind(Vote);

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: IVote = await voteDB.findOne({ id: entityId });

  if (!entity) {
    entity = await voteDB.create({ id: entityId });
  }

  entity.voting = voteId.toString();
  entity.voter = voter.toString();
  entity.supports = supports;
  entity.stake = stake;

  await voteDB.save(entity);
};
