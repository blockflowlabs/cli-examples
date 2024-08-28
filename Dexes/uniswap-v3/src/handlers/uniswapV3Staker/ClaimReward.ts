import { IFunctionContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { UniReward } from "../../types/schema";
import BigNumber from "bignumber.js";

/**
 * @dev Function::claimReward(address rewardToken, address to, uint256 amountRequested)
 * @param context trigger object with contains {functionParams: {rewardToken ,to ,amountRequested }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const ClaimRewardHandler = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your function handler logic for claimReward here

  const { functionParams, transaction, block } = context;
  const { rewardToken, to, amountRequested } = functionParams;

  const rewardDb = bind(UniReward);

  const msgSender = transaction.transaction_from_address;
  const txId = `${msgSender}_${rewardToken}`.toLowerCase();

  const uniswapReward = await rewardDb.findOne({
    id: txId,
  });

  if (!uniswapReward) {
    await rewardDb.create({
      id: txId,
      recipient: msgSender.toLowerCase(),
      rewardToken: rewardToken.toLowerCase(),
      reward: amountRequested.toString(),
      rewardRecipientAddress: to.toLowerCase(),
    });
  } else {
    uniswapReward.reward = new BigNumber(uniswapReward.reward)
      .plus(amountRequested.toString())
      .toString();

    await rewardDb.save(uniswapReward);
  }
};
