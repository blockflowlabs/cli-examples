import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Staker, Operator } from "../../types/schema";

/**
 * @dev Event::StakerDelegated(address staker, address operator)
 * @param context trigger object with contains {event: {staker ,operator }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakerDelegatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for StakerDelegated here

  const { event, transaction, block, log } = context;
  const { staker, operator } = event;

  const stakerDb: Instance = bind(Staker);
  const operatorDb: Instance = bind(Operator);

  const stakerData = await stakerDb.findOne({ id: staker.toLowerCase() });
  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });

  if (stakerData) {
    if (stakerData.operator !== operator.toLowerCase()) {
      operatorData.totalStakers += 1;
      await operatorDb.save(operatorData);
    }
    stakerData.operator = operator.toLowerCase();
    stakerData.updatedAt = block.block_timestamp;
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  } else {
    operatorData.totalStakers += 1;
    await operatorDb.save(operatorData);

    await stakerDb.create({
      id: staker.toLowerCase(),
      address: staker.toLowerCase(),
      operator: operator.toLowerCase(),
      shares: [],
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  }
};
