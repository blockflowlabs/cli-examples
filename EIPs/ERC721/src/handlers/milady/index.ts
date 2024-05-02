import {
  IEventContext,
  IBind,
  IBlock,
  Instance,
  ILog,
  ISecrets,
  ITransaction,
} from "@blockflow-labs/utils";


/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param context trigger object with contains {event: {from ,to ,tokenId }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
import { BigNumber } from "bignumber.js";

import { ITransfer, Transfer } from "../../types/schema";
import { IBalance, Balance } from "../../types/schema";
import { IToken, Token } from "../../types/schema";

interface IUpdateBalanceResult {
  user: IBalance;
  isFirstTimeHolder: boolean;
  isActiveHolder: boolean;
}

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Transfer here
  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;

  const tokenAddress = log.log_address.toLowerCase();
  const fromAddress = event.from.toLowerCase();
  const toAddress = event.to.toLowerCase();
  const value = "1"

  const transferType = fromAddress === ZERO_ADDR ? "mint" : toAddress === ZERO_ADDR ? "burn" : "transfer";

  const transferDB: Instance = bind(Transfer);
  const balanceDB: Instance = bind(Balance);
  const tokenDB: Instance = bind(Token);

  const transfer = await updateTransfer(
    transferDB,
    tokenAddress,
    fromAddress,
    toAddress,
    tokenId,
    transferType,
    transaction,
    block,
    log
  )
  await transferDB.save(transfer);

  const senderResult: IUpdateBalanceResult = await updateBalance(
    balanceDB,
    tokenAddress,
    fromAddress,
    value,
    block,
    true
  );
  const receiverResult: IUpdateBalanceResult = await updateBalance(
    balanceDB,
    tokenAddress,
    toAddress,
    value,
    block,
    false
  );
  await Promise.all([
    balanceDB.save(senderResult.user),
    balanceDB.save(receiverResult.user),
  ]);

  let holderCount =
    (senderResult.isFirstTimeHolder ? 1 : 0) +
    (receiverResult.isFirstTimeHolder ? 1 : 0);
    holderCount -= senderResult.isActiveHolder ? 0 : 1;
    holderCount -= receiverResult.isActiveHolder ? 0 : 1;

  const token = await updateToken(
    tokenDB,
    tokenAddress,
    value,
    transferType,
    holderCount.toString()
  );
  await tokenDB.save(token);
};

const updateTransfer = async (
  transferDB: Instance,
  tokenAddress: string,
  fromAddress: string,
  toAddress: string,
  tokenId: string,
  transferType: string,
  transaction: ITransaction,
  block: IBlock,
  log: ILog
): Promise<ITransfer> => {

  // Construct transaction ID
  const transactionId =
    `${transaction.transaction_hash.toString()}:${log.log_index.toString()}`.toLowerCase();

  let transfer: ITransfer = await transferDB.findOne({ id: transactionId });

  // Create a new transfer if it doesn't exist

  transfer ??= await transferDB.create({
    id: transactionId,
    from_address: fromAddress,
    to_address: toAddress,
    token_address: tokenAddress,
    tokenId: tokenId,
    transfer_type: transferType,
    transaction_from_address: transaction.transaction_from_address
      .toString()
      .toLowerCase(),
    transaction_to_address: transaction.transaction_to_address
      .toString()
      .toLowerCase(),
    transaction_hash: transaction.transaction_hash.toString(),
    log_index: log.log_index.toString(),
    block_timestamp: block.block_timestamp.toString(),
    block_hash: block.block_hash.toString(),
  });

  return transfer;
};

const updateBalance = async (
  balanceDB: Instance,
  tokenAddress: string,
  address: string,
  value: string,
  block: IBlock,
  isSender: boolean
): Promise<IUpdateBalanceResult> => {
  let isFirstTimeHolder = false;
  let isActiveHolder = true;

  // Construct user-token ID
  const userTokenId = `${address}-${tokenAddress}`.toLowerCase();
  let user: IBalance = await balanceDB.findOne({ id: userTokenId });

  // If user doesn't exist, create a new record
  if (!user) {
    user ??= await balanceDB.create({
      id: userTokenId,
      is_past_holder: true,
      is_holder: true,
    });

    isFirstTimeHolder = true;
  }

  // Update raw balance
  user.balance = new BigNumber(user.balance || "0")
    .plus(isSender ? `-${value}` : value)
    .toString();




  // Update user properties
  user.address = address;
  user.token_address = tokenAddress;
  user.block_timestamp = block.block_timestamp;
  user.block_hash = block.block_hash;

  if (user.balance === "0") {
    user.is_holder = false;
    isActiveHolder = false;
  }

  return { user, isFirstTimeHolder, isActiveHolder };
};

const updateToken = async (
  tokenDB: Instance,
  tokenAddress: any,
  value: string,
  transaction_type: string,
  holderCount: string
): Promise<IToken> => {

  let token: IToken = await tokenDB.findOne({ id: tokenAddress });

  // If token doesn't exist, create a new record

  token ??= await tokenDB.create({
    id: tokenAddress,
    address: tokenAddress,
    holder_count: "0",
    burn_event_count: "0",
    mint_event_count: "0",
    transfer_event_count: "0",
    total_supply: "0",
    total_burned: "0",
    total_minted: "0",
    total_transferred: "0",
  });

  if (transaction_type === "transfer") {
    token.transfer_event_count = new BigNumber(token.transfer_event_count)
      .plus("1")
      .toString();
    token.total_transferred = new BigNumber(token.total_transferred)
      .plus(value)
      .toString();
  } else if (transaction_type === "mint") {
    token.mint_event_count = new BigNumber(token.mint_event_count)
      .plus("1")
      .toString();
    token.total_minted = new BigNumber(token.total_minted)
      .plus(value)
      .toString();
  } else {
    token.burn_event_count = new BigNumber(token.burn_event_count)
      .plus("1")
      .toString();
    token.total_burned = new BigNumber(token.total_burned)
      .plus(value)
      .toString();
  }

  token.total_supply = new BigNumber(token.total_minted)
    .minus(token.total_burned)
    .toString();

  token.holder_count = new BigNumber(token.holder_count)
    .plus(holderCount)
    .toString();

  return token;
};