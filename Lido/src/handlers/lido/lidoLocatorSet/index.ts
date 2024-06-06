import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::LidoLocatorSet(address lidoLocator)
 * @param context trigger object with contains {event: {lidoLocator }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const LidoLocatorSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for LidoLocatorSet here

  const { event, transaction, block, log } = context;
  const { lidoLocator } = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let entity: ILidoConfig = await _loadLidoConfigEntity(lidoConfigDB);

  entity.lido_locator = lidoLocator.toString().toLowerCase();

  await lidoConfigDB.save(entity);
};
