import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { decodeTokenRebasedEvent } from "../../../utils";

/**
 * @dev Event::ETHDistributed(uint256 reportTimestamp, uint256 preCLBalance, uint256 postCLBalance, uint256 withdrawalsWithdrawn, uint256 executionLayerRewardsWithdrawn, uint256 postBufferedEther)
 * @param context trigger object with contains {event: {reportTimestamp ,preCLBalance ,postCLBalance ,withdrawalsWithdrawn ,executionLayerRewardsWithdrawn ,postBufferedEther }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ETHDistributedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ETHDistributed here

  const { event, transaction, block, log } = context;
  const {
    reportTimestamp,
    preCLBalance,
    postCLBalance,
    withdrawalsWithdrawn,
    executionLayerRewardsWithdrawn,
    postBufferedEther,
  } = event;
};
