import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::Resumed()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ResumedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Resumed here

  const { event, transaction, block, log } = context;
  const {} = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let entity: ILidoConfig = await _loadLidoConfigEntity(lidoConfigDB);

  entity.is_stopped = false;

  await lidoConfigDB.save(entity);
};
