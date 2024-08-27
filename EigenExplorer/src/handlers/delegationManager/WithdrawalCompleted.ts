import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Withdrawal } from "../../types/schema";
/**
 * @dev Event::WithdrawalCompleted(bytes32 withdrawalRoot)
 * @param context trigger object with contains {event: {withdrawalRoot }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalCompletedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for WithdrawalCompleted here

  const { event, transaction, block, log } = context;
  const { withdrawalRoot } = event;

  const withdrawalDb: Instance = bind(Withdrawal);

  const withdrawalData = await withdrawalDb.findOne({ id: withdrawalRoot });

  // update the withdrawal record
  if (withdrawalData) {
    withdrawalData.isCompleted = true;
    withdrawalData.updatedAt = block.block_timestamp;
    withdrawalData.updatedAtBlock = block.block_number;
    await withdrawalDb.updateOne({ id: withdrawalRoot }, withdrawalData);
  }
};
