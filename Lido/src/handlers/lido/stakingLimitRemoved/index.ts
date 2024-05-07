import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::StakingLimitRemoved()
 * @param context trigger object with contains {event: {}, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakingLimitRemovedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for StakingLimitRemoved here

  const { event, transaction, block, log } = context;
  const {} = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let lidoConfig: ILidoConfig = await _loadLidoConfigEntity(
    lidoConfigDB,
    context,
  );

  lidoConfig.max_stake_limit = "0";

  await lidoConfigDB.save(lidoConfig);
};
