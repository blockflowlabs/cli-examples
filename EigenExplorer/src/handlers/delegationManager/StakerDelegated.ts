import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Staker, Operator, Stats } from "../../types/schema";
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

  const stakerDb: Instance = bind(Staker);
  const operatorDb: Instance = bind(Operator);
  const statsDb: Instance = bind(Stats);

  const stakerData = await stakerDb.findOne({ id: staker.toLowerCase() });
  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });

  if (stakerData) {
    if (stakerData.operator !== operator.toLowerCase()) {
      operatorData.totalStakers = operatorData.totalStakers + 1 || 1;
      await operatorDb.save(operatorData);
    }
    if (stakerData.operator === null) {
      await updateStats(statsDb, "totalActiveStakers", 1);
    }
    stakerData.operator = operator.toLowerCase();
    stakerData.updatedAt = block.block_timestamp;
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  } else {
    operatorData.totalStakers = operatorData.totalStakers + 1 || 1;
    await operatorDb.save(operatorData);

    await stakerDb.create({
      id: staker.toLowerCase(),
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
