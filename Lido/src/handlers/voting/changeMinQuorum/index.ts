import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVotingConfig, VotingConfig } from "../../../types/schema";
import { _loadVotingConfigEntity } from "../../../helpers";

/**
 * @dev Event::ChangeMinQuorum(uint64 minAcceptQuorumPct)
 * @param context trigger object with contains {event: {minAcceptQuorumPct }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ChangeMinQuorumHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ChangeMinQuorum here

  const { event, transaction, block, log } = context;
  const { minAcceptQuorumPct } = event;

  const votingConfigDB: Instance = bind(VotingConfig);

  let entity: IVotingConfig = await _loadVotingConfigEntity(votingConfigDB);

  entity.min_accept_quorum_pct = minAcceptQuorumPct;

  await votingConfigDB.save(entity);
};
