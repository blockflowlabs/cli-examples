import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { LiquidationBorrow, ILiquidationBorrow } from "../../types/schema";

import { convertToString } from "../../utils";

/**
 * @dev Event::LiquidateBorrow(address liquidator, address borrower, uint256 repayAmount, address rTokenCollateral, uint256 seizeTokens)
 * @param context trigger object with contains {event: {liquidator ,borrower ,repayAmount ,rTokenCollateral ,seizeTokens }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const LiquidateBorrowHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for LiquidateBorrow here

  const { event, transaction, block, log } = context;

  const { liquidator, borrower, repayAmount, rTokenCollateral, seizeTokens } =
    event;

  let liquidationBorrowDB: Instance = bind(LiquidationBorrow);

  let liquidationBorrowId = convertToString(
    `${transaction.transaction_hash}-${log.log_index}`
  );

  let liquidationBorrow: ILiquidationBorrow = await liquidationBorrowDB.findOne(
    {
      id: liquidationBorrowId,
    }
  );

  if (!liquidationBorrow) {
    liquidationBorrow = await liquidationBorrowDB.create({
      id: liquidationBorrowId,
      liquidator: convertToString(liquidator),
      borrower: convertToString(borrower),
      repay_amount: repayAmount.toString(),
      address: convertToString(log.log_address),
      seize_token: seizeTokens.toString(),
      rtoken_collateral: convertToString(rTokenCollateral),
      block_timestamp: block.block_timestamp,
      transaction_hash: transaction.transaction_hash,
    });
  }
};
