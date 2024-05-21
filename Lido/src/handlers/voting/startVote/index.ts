import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVoting, Voting } from "../../../types/schema";

/**
 * @dev Event::StartVote(uint256 voteId, address creator, string metadata)
 * @param context trigger object with contains {event: {voteId ,creator ,metadata }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StartVoteHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for StartVote here

  const { event, transaction, block, log } = context;
  const { voteId, creator, metadata } = event;

  const votingDB: Instance = bind(Voting);

  let entity: IVoting = await votingDB.findOne({ id: voteId.toString() });

  if (!entity) {
    entity = await votingDB.create({ id: voteId.toString() });
  }

  entity.index = voteId.toString();
  entity.creator = creator.toString();
  entity.metadata = metadata.toString();

  entity.executed = false;

  entity.block_timestamp = block.block_timestamp;
  entity.transaction_hash = transaction.transaction_hash;
  entity.log_index = log.log_index;

  await votingDB.save(entity);
};
