import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Operator } from "../../types/schema";
import BigNumber from "bignumber.js";

/**
 * @dev Event::OperatorSharesIncreased(address operator, address staker, address strategy, uint256 shares)
 * @param context trigger object with contains {event: {operator ,staker ,strategy ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSharesIncreasedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for OperatorSharesIncreased here

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
        .plus(shares)
        .toString();
    } else {
      operatorData.strategies.push(strategy.toLowerCase());
      operatorData.shares.push(shares.toString());
    }
    operatorData.updatedAt = block.block_timestamp;
    operatorData.updatedAtBlock = block.block_number;

    await operatorDb.save(operatorData);
  }
};
