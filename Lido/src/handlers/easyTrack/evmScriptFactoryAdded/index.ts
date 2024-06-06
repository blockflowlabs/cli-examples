import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { EVMScriptFactory, IEVMScriptFactory } from "../../../types/schema";

/**
 * @dev Event::EVMScriptFactoryAdded(address _evmScriptFactory, bytes _permissions)
 * @param context trigger object with contains {event: {_evmScriptFactory ,_permissions }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const EVMScriptFactoryAddedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for EVMScriptFactoryAdded here

  const { event, transaction, block, log } = context;
  const { _evmScriptFactory, _permissions } = event;

  const evmScriptFactoryDB: Instance = bind(EVMScriptFactory);

  let entity: IEVMScriptFactory = await evmScriptFactoryDB.findOne({
    id: _evmScriptFactory.toString(),
  });

  if (!entity) {
    entity = await evmScriptFactoryDB.create({
      id: _evmScriptFactory.toString(),
    });
    entity.address = _evmScriptFactory.toString();
    entity.permissions = _permissions.toString();
    entity.is_active = true;
  }

  await evmScriptFactoryDB.save(entity);
};
