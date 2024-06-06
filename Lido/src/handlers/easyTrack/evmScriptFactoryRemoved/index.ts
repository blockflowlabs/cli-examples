import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { EVMScriptFactory, IEVMScriptFactory } from "../../../types/schema";

/**
 * @dev Event::EVMScriptFactoryRemoved(address _evmScriptFactory)
 * @param context trigger object with contains {event: {_evmScriptFactory }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const EVMScriptFactoryRemovedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for EVMScriptFactoryRemoved here

  const { event, transaction, block, log } = context;
  const { _evmScriptFactory } = event;

  const evmScriptFactoryDB: Instance = bind(EVMScriptFactory);

  let entity: IEVMScriptFactory = await evmScriptFactoryDB.findOne({
    id: _evmScriptFactory.toString(),
  });

  if (!entity) {
    entity = await evmScriptFactoryDB.create({
      id: _evmScriptFactory.toString(),
    });
  }

  entity.is_active = false;

  await evmScriptFactoryDB.save(entity);
};
