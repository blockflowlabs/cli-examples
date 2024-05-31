import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::StakingResumed()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakingResumedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for StakingResumed here

  const { event, transaction, block, log } = context;
  const {} = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let entity: ILidoConfig = await _loadLidoConfigEntity(lidoConfigDB);

  entity.is_staking_paused = false;

  await lidoConfigDB.save(entity);
};
