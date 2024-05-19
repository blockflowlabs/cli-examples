import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  ClaimIncentiveCall,
  IClaimIncentiveCall,
  User,
  IUser,
} from "../../../types/schema";

var BigNumber = require("bignumber.js");

/**
 * @dev Event::RewardsClaimed(address user, address to, address claimer, uint256 amount)
 * @param context trigger object with contains {event: {user ,to ,claimer ,amount }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const RewardsClaimedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for RewardsClaimed here

  const { event, transaction, block, log } = context;
  const { user, to, claimer, amount } = event;

  let userDB = bind(User);
  let claimIncentiveCallDB = bind(ClaimIncentiveCall);

  let $user: IUser = await userDB.findOne({ id: user });
  if (!$user) {
    await userDB.create({
      id: user,
      borrowedReservesCount: 0,
      unclaimedRewards: "0",
      incentivesLastUpdated: 0,
      lifetimeRewards: "0",
    });
  }

  $user = await userDB.findOne({ id: user });

  $user.unclaimedRewards = new BigNumber(user.unclaimedRewards)
    .minus(amount)
    .toString();
  $user.incentivesLastUpdated = Number(event.block.timestamp);
  await userDB.save($user);

  const cicId =
    block.block_number.toString() +
    ":" +
    transaction.transaction_index.toString() +
    ":" +
    transaction.transaction_hash.toString() +
    ":" +
    log.log_index.toString() +
    ":" +
    log.log_transaction_index.toString();

  await claimIncentiveCallDB.create({
    id: cicId,
    incentivesController: event.address.toString(),
    user: event.user,
    amount: amount.toString(),
  });
};
