import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { EasyTrackConfig, IEasyTrackConfig } from "../../../types/schema";
import { _loadEasyTrackConfigEntity } from "../../../helpers";

/**
 * @dev Event::EVMScriptExecutorChanged(address _evmScriptExecutor)
 * @param context trigger object with contains {event: {_evmScriptExecutor }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const EVMScriptExecutorChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for EVMScriptExecutorChanged here

  const { event, transaction, block, log } = context;
  const { _evmScriptExecutor } = event;

  const easyTrackConfigDB: Instance = bind(EasyTrackConfig);

  let entity: IEasyTrackConfig =
    await _loadEasyTrackConfigEntity(easyTrackConfigDB);

  entity.evm_script_executor = _evmScriptExecutor.toString();

  await easyTrackConfigDB.save(entity);
};
