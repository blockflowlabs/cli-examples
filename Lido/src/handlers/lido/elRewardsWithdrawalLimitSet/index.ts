import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::ELRewardsWithdrawalLimitSet(uint256 limitPoints)
 * @param context trigger object with contains {event: {limitPoints }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ELRewardsWithdrawalLimitSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for ELRewardsWithdrawalLimitSet here

  const { event, transaction, block, log } = context;
  const { limitPoints } = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let lidoConfig: ILidoConfig = await _loadLidoConfigEntity(
    lidoConfigDB,
    context
  );

  lidoConfig.el_rewards_withdrawal_limit_points = limitPoints.toLowerCase();

  await lidoConfigDB.save(lidoConfig);
};
