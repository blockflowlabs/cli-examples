import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { updateStats } from "../../utils/helpers";
import { Staker, Operator, Stats, IStaker, IOperator } from "../../types/generated";

/**
 * @dev Event::StakerUndelegated(address staker, address operator)
 * @param context trigger object with contains {event: {staker ,operator }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakerUndelegatedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for StakerUndelegated here

  const { event, transaction, block, log } = context;
  const { staker, operator } = event;

  const client = Instance.PostgresClient(bind);

  const stakerDb = client.db(Staker);
  const operatorDb = client.db(Operator);
  const statsDb = client.db(Stats);

  const stakerData: IStaker = await stakerDb.load({ address: staker.toLowerCase() });
  const operatorData: IOperator = await operatorDb.load({ address: operator.toLowerCase() });

  // update the staker record
  if (stakerData) {
    if (stakerData.operator?.toLowerCase() === operator.toLowerCase())
      operatorData.totalStakers = Number(operatorData.totalStakers) - 1;

    if (stakerData.operator !== "") await updateStats(statsDb, "totalActiveStakers", 1, "subtract");

    stakerData.operator = "";
    stakerData.updatedAt = parseInt(block.block_timestamp);
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  } else {
    await stakerDb.save({
      address: staker.toLowerCase(),
      operator: "",
      shares: [],
      totalWithdrawals: 0,
      totalDeposits: 0,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });

    await updateStats(statsDb, "totalRegisteredStakers", 1);
  }

  await operatorDb.save(operatorData);
};
