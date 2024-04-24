import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { BigNumber } from "bignumber.js";

import { User } from "../types/schema";

import { IUser } from "../types/schema";

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  let { event, transaction, block, log } = context;
  let { from, to, value } = event;

  // Convert addresses to lowercase
  from = from.toString().toLowerCase();
  to = to.toString().toLowerCase();
  value = value.toString();

  let txnTimestamp = block.block_timestamp.toString();

  const userDB = bind(User);

  // Update sender
  let sender: IUser = await updateUserTransaction(
    userDB,
    from,
    value,
    txnTimestamp,
    true
  );

  // Update receiver
  let receiver: IUser = await updateUserTransaction(
    userDB,
    to,
    value,
    txnTimestamp,
    false
  );

  // Save sender and receiver
  await Promise.all([userDB.save(sender), userDB.save(receiver)]);
};

/**
 * Update user's transaction details
 * @param userDB database object
 * @param userId user's ID
 * @param value transaction value
 * @param txnTimestamp transaction timestamp
 * @param isSender indicates if the user is the sender
 */
const updateUserTransaction = async (
  userDB: Instance,
  userId: string,
  value: string,
  txnTimestamp: string,
  isSender: boolean
): Promise<IUser> => {
  // Find user
  let user: IUser = await userDB.findOne({ id: userId });

  // If user doesn't exist, create new user
  if (!user) {
    user = await userDB.create({ id: userId, balance: "0", txnCount: "0" });
  }

  // Update balance and transaction count
  user.balance = new BigNumber(user.balance)
    .plus(isSender ? `-${value}` : value)
    .toString();
  user.txnCount = new BigNumber(user.txnCount).plus("1").toString();

  // Update smallest and largest transactions
  let currentLargestTxn = new BigNumber(user.largestTxn || value);
  let currentSmallestTxn = new BigNumber(user.smallestTxn || value);
  let currentLastTxnOn = new BigNumber(user.lastTxnOn || txnTimestamp);

  if (currentLargestTxn.isLessThanOrEqualTo(value)) {
    user.largestTxn = value;
  }

  if (currentSmallestTxn.isGreaterThanOrEqualTo(value)) {
    user.smallestTxn = value;
  }

  if (currentLastTxnOn.isLessThanOrEqualTo(txnTimestamp)) {
    user.lastTxnOn = txnTimestamp;
  }

  return user;
};
