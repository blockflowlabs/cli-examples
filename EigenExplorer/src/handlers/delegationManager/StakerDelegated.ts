import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Staker, Operator, Stats } from "../../types/generated";
import { updateStats } from "../../utils/helpers";

/**
 * @dev Event::StakerDelegated(address staker, address operator)
 * @param context trigger object with contains {event: {staker ,operator }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakerDelegatedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for StakerDelegated here

  const { event, transaction, block, log } = context;
  const { staker, operator } = event;

  const client = Instance.PostgresClient(bind);

  const stakerDb = client.db(Staker);
  const operatorDb = client.db(Operator);
  const statsDb = client.db(Stats);

  const stakerData = await stakerDb.load({ address: staker.toLowerCase() });
  const operatorData = await operatorDb.load({ address: operator.toLowerCase() });

  if (stakerData) {
    // if (stakerData.operator !== operator.toLowerCase()) {
    //   operatorData.totalStakers = Number(operatorData.totalStakers) + 1 || 1;
    //   await operatorDb.save(operatorData);
    // }
    if (stakerData.operator === null) {
      await updateStats(statsDb, "totalActiveStakers", 1);
    }
    stakerData.operator = operator.toLowerCase();
    stakerData.updatedAt = block.block_timestamp;
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  } else {
    // operatorData.totalStakers = Number(operatorData.totalStakers) + 1 || 1;
    // await operatorDb.save(operatorData);

    await stakerDb.save({
      address: staker.toLowerCase(),
      operator: operator.toLowerCase(),
      shares: [],
      totalWithdrawals: 0,
      totalDeposits: 0,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });

    await updateStats(statsDb, "totalRegisteredStakers", 1);
    await updateStats(statsDb, "totalActiveStakers", 1);
  }
};
