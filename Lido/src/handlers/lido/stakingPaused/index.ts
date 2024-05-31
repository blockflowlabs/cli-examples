import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::StakingPaused()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakingPausedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for StakingPaused here

  const { event, transaction, block, log } = context;
  const {} = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let entity: ILidoConfig = await _loadLidoConfigEntity(lidoConfigDB, context);

  entity.is_staking_paused = true;

  await lidoConfigDB.save(entity);
};
