import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Deposit } from "../../types/schema";

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

  const depositDb = bind(Deposit);

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
};
