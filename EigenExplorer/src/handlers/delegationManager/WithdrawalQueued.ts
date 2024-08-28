import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Withdrawal, Staker } from "../../types/schema";
import BigNumber from "bignumber.js";

/**
 * @dev Event::WithdrawalQueued(bytes32 withdrawalRoot, tuple withdrawal)
 * @param context trigger object with contains {event: {withdrawalRoot ,withdrawal }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalQueuedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for WithdrawalQueued here

  const { event, transaction, block, log } = context;
  const { withdrawalRoot, withdrawal } = event;

  const withdrawalDb: Instance = bind(Withdrawal);
  const stakerDb: Instance = bind(Staker);

  const withdrawalData = await withdrawalDb.findOne({ id: withdrawalRoot });
  const stakerData = await stakerDb.findOne({
    id: withdrawal.staker.toLowerCase(),
  });

  // update the staker's shares for the corresponding strategies
  if (stakerData) {
    for (let i = 0; i < withdrawal.strategies.length; i++) {
      const strategy = withdrawal.strategies[i];
      const share = withdrawal.shares[i];
      const strategyIndex = stakerData.strategies.findIndex(
        (s: string) => s === strategy.toLowerCase()
      );
      if (strategyIndex !== -1) {
        const newShare = new BigNumber(stakerData.shares[strategyIndex])
          .minus(share.toString())
          .toString();

        // if the share is 0, remove the strategy from the staker
        if (newShare === "0") {
          stakerData.strategies.splice(strategyIndex, 1);
          stakerData.shares.splice(strategyIndex, 1);
        }
      }
    }

    await stakerDb.save(stakerData);
  }

  if (!withdrawalData) {
    // create a new withdrawal record
    await withdrawalDb.create({
      id: withdrawalRoot,
      withdrawalRoot,
      nonce: Number(withdrawal.nonce),
      stakerAddress: withdrawal.staker,
      delegatedTo: withdrawal.delegatedTo,
      withdrawerAddress: withdrawal.withdrawer,
      strategies: withdrawal.strategies,
      shares: withdrawal.shares.map((share: any) => share.toString()),
      isCompleted: false,
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
    });
  } else {
    // update the existing withdrawal record
    withdrawalData.nonce = Number(withdrawal.nonce);
    withdrawalData.stakerAddress = withdrawal.stakerAddress;
    withdrawalData.delegatedTo = withdrawal.delegatedTo;
    withdrawalData.withdrawerAddress = withdrawal.withdrawerAddress;
    withdrawalData.strategies = withdrawal.strategies;
    withdrawalData.shares = withdrawal.shares.map((share: any) =>
      share.toString()
    );
    withdrawalData.updatedAt = block.block_timestamp;
    withdrawalData.updatedAtBlock = block.block_number;

    await withdrawalDb.save(withdrawalData);
  }
};
