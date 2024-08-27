import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import BigNumber from "bignumber.js";
import { Operator } from "../../types/schema";

/**
 * @dev Event::OperatorSharesDecreased(address operator, address staker, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {operator ,staker ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSharesDecreasedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for OperatorSharesDecreased here

  const { event, transaction, block, log } = context;
  const { operator, staker, strategy, shares } = event;

  const operatorDb: Instance = bind(Operator);

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });

  if (operatorData) {
    const strategyIndex = operatorData.strategies.findIndex(
      (s: string) => s === strategy.toLowerCase()
    );
    if (strategyIndex !== -1) {
      operatorData.shares[strategyIndex] = new BigNumber(
        operatorData.shares[strategyIndex]
      )
        .minus(shares)
        .toString();
      operatorData.updatedAt = block.block_timestamp;
      operatorData.updatedAtBlock = block.block_number;
      await operatorDb.updateOne({ id: operator.toLowerCase() }, operatorData);
    }
  }
};
