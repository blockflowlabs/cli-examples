import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Stats } from "../../types/generated";

/**
 * @dev Event::MinWithdrawalDelayBlocksSet(uint256 previousValue, uint256 newValue)
 * @param context trigger object with contains {event: {previousValue ,newValue }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MinWithdrawalDelayBlocksSetHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for MinWithdrawalDelayBlocksSet here

  const { event, transaction, block, log } = context;
  const { previousValue, newValue } = event;

  console.log("min withdrawal delay");

  const client = Instance.PostgresClient(bind);

  const statsDb = client.db(Stats);

  const statsData = await statsDb.load({ statId: "eigen_explorer_stats" });

  if (statsData) {
    statsData.minWithdrawalDelayBlocks = Number(newValue);

    await statsDb.save(statsData);
  } else {
    await statsDb.save({
      statId: "eigen_explorer_stats",
      totalRegisteredAvs: 0,
      totalActiveAvs: 0,
      totalRegisteredOperators: 0,
      totalActiveOperators: 0,
      totalRegisteredStakers: 0,
      totalActiveStakers: 0,
      totalDepositWhitelistStrategies: 0,
      totalCompletedWithdrawals: 0,
      totalWithdrawals: 0,
      totalDeposits: 0,
      minWithdrawalDelayBlocks: Number(newValue),
    });
  }
};
