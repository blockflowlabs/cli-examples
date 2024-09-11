import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Deposit, IStaker, Staker } from "../../types/schema";
import BigNumber from "bignumber.js";

/**
 * @dev Event::Deposit(address staker, address token, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {staker ,token ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Deposit here

  const { event, transaction, block, log } = context;
  const { staker, token, strategy, shares } = event;

  const stakerDb = bind(Staker);
  const depositDb = bind(Deposit);

  const stakerData: IStaker = await stakerDb.findOne({
    id: staker.toLowerCase(),
  });

  const depositId =
    `${transaction.transaction_hash}_${log.log_index}`.toLowerCase();

  const depositData = await depositDb.findOne({
    id: depositId,
  });

  if (!depositData) {
    await depositDb.create({
      id: depositId,
      transactionHash: transaction.transaction_hash,
      stakerAddress: staker.toLowerCase(),
      tokenAddress: token.toLowerCase(),
      strategyAddress: strategy.toLowerCase(),
      shares: shares.toString(),
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
    });
  }

  if (!stakerData) {
    await stakerDb.create({
      id: staker.toLowerCase(),
      address: staker.toLowerCase(),
      shares: [{ shares: shares.toString(), strategy: strategy.toString() }],
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  } else {
    const strategyIndex = stakerData.shares.findIndex(
      (s: any) => s.strategy.toLowerCase() === strategy.toLowerCase()
    );
    if (strategyIndex === -1) {
      stakerData.shares.push({
        shares: shares.toString(),
        strategy: strategy.toString(),
      });
    } else {
      stakerData.shares[strategyIndex].shares = new BigNumber(
        stakerData.shares[strategyIndex].shares
      )
        .plus(shares.toString())
        .toString();
    }
    stakerData.updatedAt = Number(block.block_timestamp);
    stakerData.updatedAtBlock = block.block_number;

    await stakerDb.save(stakerData);
  }
};
