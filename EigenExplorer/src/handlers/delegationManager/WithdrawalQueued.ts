import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Withdrawal, Stats } from "../../types/schema";
import { updateStats } from "../../utils/helpers";

/**
 * @dev Event::WithdrawalQueued(bytes32 withdrawalRoot, tuple withdrawal)
 * @param context trigger object with contains {event: {withdrawalRoot ,withdrawal }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalQueuedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for WithdrawalQueued here

  const { event, transaction, block, log } = context;
  const { withdrawalRoot, withdrawal } = event;

  const withdrawalDb: Instance = bind(Withdrawal);
  const statsDb: Instance = bind(Stats);

  const withdrawalData = await withdrawalDb.findOne({ id: withdrawalRoot });

  if (!withdrawalData) {
    // create a new withdrawal record
    await withdrawalDb.create({
      id: withdrawalRoot,
      withdrawalRoot,
      nonce: Number(withdrawal.nonce),
      stakerAddress: withdrawal.staker,
      delegatedTo: withdrawal.delegatedTo,
      withdrawerAddress: withdrawal.withdrawer,
      strategyShares: withdrawal.strategies.map((strategy: any, index: number) => ({
        strategy: strategy,
        shares: withdrawal.shares[index].toString(),
      })),
      isCompleted: false,
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAt: block.block_timestamp,
      updatedAtBlock: block.block_number,
    });
  } else {
    // update the existing withdrawal record
    withdrawalData.nonce = Number(withdrawal.nonce);
    withdrawalData.stakerAddress = withdrawal.stakerAddress;
    withdrawalData.delegatedTo = withdrawal.delegatedTo;
    withdrawalData.withdrawerAddress = withdrawal.withdrawerAddress;
    withdrawalData.strategyShares = withdrawal.strategies.map((strategy: any, index: number) => ({
      strategy: strategy.toLowerCase(),
      shares: withdrawal.shares[index].toString(),
    }));
    withdrawalData.updatedAt = block.block_timestamp;
    withdrawalData.updatedAtBlock = block.block_number;

    await withdrawalDb.save(withdrawalData);
  }

  await updateStats(statsDb, "totalQueuedWithdrawals", 1);
};
