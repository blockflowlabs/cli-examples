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
import { AccountBalance, IAccountBalance } from "../../types/schema";
import { Account, IAccount } from "../../types/schema";
import { AccountDailySnapshot, IAccountDailySnapshot } from "../../types/schema";
import { getAccountMetadata } from "../../utils/account";

export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { from, to, tokenId } = event;
  
  const accountMetadata = getAccountMetadata(from);

  const accountId = accountMetadata.address;
  const balanceId = `${log.log_index}-${block.block_timestamp}`;
  const snapshotId = `${log.log_index}-${block.block_timestamp}-${block.block_number.toString()}`;

  //connections
  const accountDB: Instance = bind(Account);
  const accountBalanceDB: Instance = bind(AccountBalance);
  const accountDailySnapshotDB: Instance = bind(AccountDailySnapshot);


  let account: IAccount = await accountDB.findOne({
    id: accountId,
  });
  account ??= await accountDB.create({
    id: accountId,
    tokenCount: "0",
  });


  let accountBalance: IAccountBalance = await accountBalanceDB.findOne({
    id: balanceId
  });
  accountBalance ??= await accountBalanceDB.create({
    id: balanceId,
    account: accountId,
    CollectionERC721: tokenId,
    tokenCount: "0",
    blockNumber: block.block_number,
    timeStamp: block.block_timestamp,
  });

  
  let accountDailySnapshot: IAccountDailySnapshot = await accountDailySnapshotDB.findOne({
    id: snapshotId,
  });
  accountDailySnapshot ??= await accountDailySnapshotDB.create({
    id: snapshotId,
    account: accountId,
    CollectionERC721: tokenId,
    tokenCount: "0",
    blockNumber: block.block_number,
    timeStamp: block.block_timestamp,
  });
};

