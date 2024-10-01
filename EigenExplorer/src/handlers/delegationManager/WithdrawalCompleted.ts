import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Strategies, Withdrawal } from "../../types/schema";
import { getSharesToUnderlying } from "../../utils/helpers";
import { eigenContracts } from "../../data/address";
import BigNumber from "bignumber.js";
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
  const strategiesDb: Instance = bind(Strategies);

  const withdrawalData = await withdrawalDb.findOne({ id: withdrawalRoot });

  // update the withdrawal record
  if (withdrawalData) {
    withdrawalData.isCompleted = true;
    withdrawalData.updatedAt = block.block_timestamp;
    withdrawalData.updatedAtBlock = block.block_number;

    await withdrawalDb.save(withdrawalData);

    // update strategy's restaking tvl and underlying to 1e18 ratio
    const rpcEndpoint = secrets["RPC_ENDPOINT"];

    for (const key in withdrawalData.strategyShares) {
      const shares = withdrawalData.strategyShares[key];
      const underlying =
        eigenContracts.Strategies.Eigen?.strategyContract.toLowerCase() ===
        shares.strategy.toLowerCase()
          ? BigInt(1e18)
          : await getSharesToUnderlying(
              shares.strategy,
              (1e18).toString(),
              rpcEndpoint
            );

      const strategyData = await strategiesDb.findOne({
        id: shares.strategy.toLowerCase(),
      });

      if (strategyData) {
        console.log(shares.shares.toString());
        const totalShares = new BigNumber(strategyData.totalShares);
        const sharesToMinus = new BigNumber(shares.shares.toString());

        const newTotalShares = totalShares.isGreaterThan(sharesToMinus)
          ? totalShares.minus(sharesToMinus).toString()
          : "0";

        strategyData.totalShares = newTotalShares;
        strategyData.sharesToUnderlying = underlying.toString();
        strategyData.updatedAt = block.block_timestamp;
        strategyData.updatedAtBlock = block.block_number;
        await strategiesDb.save(strategyData);
      }
    }
  }
};
