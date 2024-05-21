import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVotingConfig, VotingConfig } from "../../../types/schema";
import { _loadVotingConfigEntity } from "../../../helpers";

/**
 * @dev Event::ChangeObjectionPhaseTime(uint64 objectionPhaseTime)
 * @param context trigger object with contains {event: {objectionPhaseTime }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ChangeObjectionPhaseTimeHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ChangeObjectionPhaseTime here

  const { event, transaction, block, log } = context;
  const { objectionPhaseTime } = event;
  const votingConfigDB: Instance = bind(VotingConfig);

  let entity: IVotingConfig = await _loadVotingConfigEntity(votingConfigDB);

  entity.objection_phase_time = objectionPhaseTime;

  await votingConfigDB.save(entity);
};
