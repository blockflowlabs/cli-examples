import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::Stopped()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StoppedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Stopped here

  const { event, transaction, block, log } = context;
  const {} = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let lidoConfig: ILidoConfig = await _loadLidoConfigEntity(
    lidoConfigDB,
    context,
  );

  lidoConfig.is_stopped = true;

  await lidoConfigDB.save(lidoConfig);
};
