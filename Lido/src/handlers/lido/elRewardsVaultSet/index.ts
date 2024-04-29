import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::ELRewardsVaultSet(address executionLayerRewardsVault)
 * @param context trigger object with contains {event: {executionLayerRewardsVault }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ELRewardsVaultSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for ELRewardsVaultSet here

  const { event, transaction, block, log } = context;
  const { executionLayerRewardsVault } = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let lidoConfig: ILidoConfig = await _loadLidoConfigEntity(
    lidoConfigDB,
    context
  );

  lidoConfig.el_rewards_vault = executionLayerRewardsVault.toLowerCase();

  await lidoConfigDB.save(lidoConfig);
};
