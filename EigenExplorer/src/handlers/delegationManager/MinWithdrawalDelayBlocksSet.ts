import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Stats } from "../../types/schema";

/**
 * @dev Event::MinWithdrawalDelayBlocksSet(uint256 previousValue, uint256 newValue)
 * @param context trigger object with contains {event: {previousValue ,newValue }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MinWithdrawalDelayBlocksSetHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for MinWithdrawalDelayBlocksSet here

  const { event, transaction, block, log } = context;
  const { previousValue, newValue } = event;

  const statsDb: Instance = bind(Stats);

  const statsData = await statsDb.findOne({ id: "eigen_explorer_stats" });

  if (statsData) {
    statsData.minWithdrawalDelayBlocks = newValue;

    await statsDb.save(statsData);
  } else {
    await statsDb.create({
      id: "eigen_explorer_stats",
      totalRegisteredAvs: 0,
      totalActiveAvs: 0,
      totalRegisteredOperators: 0,
      totalActiveOperators: 0,
      totalRegisteredStakers: 0,
      totalActiveStakers: 0,
      totalDepositWhitelistStrategies: 0,
      totalCompletedWithdrawals: 0,
      totalQueuedWithdrawals: 0,
      totalDeposits: 0,
      minWithdrawalDelayBlocks: Number(newValue),
    });
  }
};
