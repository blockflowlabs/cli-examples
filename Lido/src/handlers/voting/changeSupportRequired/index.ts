import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IVotingConfig, VotingConfig } from "../../../types/schema";
import { _loadVotingConfigEntity } from "../../../helpers";

/**
 * @dev Event::ChangeSupportRequired(uint64 supportRequiredPct)
 * @param context trigger object with contains {event: {supportRequiredPct }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ChangeSupportRequiredHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ChangeSupportRequired here

  const { event, transaction, block, log } = context;
  const { supportRequiredPct } = event;

  const votingConfigDB: Instance = bind(VotingConfig);

  let entity: IVotingConfig = await _loadVotingConfigEntity(votingConfigDB);

  entity.support_required_pct = supportRequiredPct;

  await votingConfigDB.save(entity);
};
