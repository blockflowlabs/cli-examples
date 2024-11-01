import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Staker, Operator, Stats, IOperator, IStaker } from "../../types/generated";
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

  let stakerData: IStaker = await stakerDb.load({ address: staker.toLowerCase() });
  const operatorData: IOperator = await operatorDb.load({ address: operator.toLowerCase() });

  if (stakerData) {
    // if the staker operator doesn't match then increase operator stakers count
    if (stakerData.operator?.toLowerCase() !== operator.toLowerCase())
      operatorData.totalStakers = Number(operatorData.totalStakers) + 1;

    if (stakerData.operator === "") await updateStats(statsDb, "totalActiveStakers", 1);

    // update the operator addres to new operator
    stakerData.operator = operator.toLowerCase();

    // last interaction details
    stakerData.updatedAt = parseInt(block.block_timestamp);
    stakerData.updatedAtBlock = block.block_number;
  } else {
    operatorData.totalStakers = Number(operatorData.totalStakers) + 1;

    stakerData = {
      address: staker.toLowerCase(),
      operator: operator.toLowerCase(),
      shares: [],
      totalWithdrawals: 0,
      totalDeposits: 0,
      createdAt: parseInt(block.block_timestamp),
      updatedAt: parseInt(block.block_timestamp),
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    };

    await updateStats(statsDb, "totalRegisteredStakers", 1);
    await updateStats(statsDb, "totalActiveStakers", 1);
  }

  await stakerDb.save(stakerData);
  await operatorDb.save(operatorData);
};
