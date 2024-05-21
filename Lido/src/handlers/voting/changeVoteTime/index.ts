import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVotingConfig, VotingConfig } from "../../../types/schema";
import { _loadVotingConfigEntity } from "../../../helpers";

/**
 * @dev Event::ChangeVoteTime(uint64 voteTime)
 * @param context trigger object with contains {event: {voteTime }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ChangeVoteTimeHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ChangeVoteTime here

  const { event, transaction, block, log } = context;
  const { voteTime } = event;

  const votingConfigDB: Instance = bind(VotingConfig);

  let entity: IVotingConfig = await _loadVotingConfigEntity(votingConfigDB);

  entity.vote_time = voteTime;

  await votingConfigDB.save(entity);
};
