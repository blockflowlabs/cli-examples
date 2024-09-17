import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Staker } from "../../types/schema";

/**
 * @dev Event::StakerUndelegated(address staker, address operator)
 * @param context trigger object with contains {event: {staker ,operator }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const StakerUndelegatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for StakerUndelegated here

  const { event, transaction, block, log } = context;
  const { staker, operator } = event;

  const stakerDb: Instance = bind(Staker);

  const stakerData = await stakerDb.findOne({ id: staker.toLowerCase() });

  // update the staker record
  if (stakerData) {
    stakerData.operator = null;
    stakerData.updatedAt = block.block_timestamp;
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  } else {
    await stakerDb.create({
      id: staker.toLowerCase(),
      address: staker.toLowerCase(),
      operator: null,
      shares: [],
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  }
};
