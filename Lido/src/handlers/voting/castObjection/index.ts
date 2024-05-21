import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVotingObjection, VotingObjection } from "../../../types/schema";

/**
 * @dev Event::CastObjection(uint256 voteId, address voter, uint256 stake)
 * @param context trigger object with contains {event: {voteId ,voter ,stake }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const CastObjectionHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for CastObjection here

  const { event, transaction, block, log } = context;
  const { voteId, voter, stake } = event;

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  const votingObjectionDB: Instance = bind(VotingObjection);

  let entity: IVotingObjection = await votingObjectionDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await votingObjectionDB.create({
      id: entityId,
    });
  }

  entity.voting = voteId.toString();

  entity.voter = voter.toString();

  entity.stake = stake;

  await votingObjectionDB.save(entity);
};
