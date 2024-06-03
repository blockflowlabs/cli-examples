import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { ERC20Table, IERC20Table } from "../../types/schema";
import BigNumber from "bignumber.js";
import { getTokenMetadata } from "../../utils/ERC20Metadata";
/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context;
  const { from, to, value } = event;
  const tokenMetadata = getTokenMetadata(log.log_address);
  //credit or debit
  const uniqueId = `${transaction.transaction_hash}-${log.log_index}-`;
  const address = from.toString();
  const counterPartyAddress = to.toString();
  const divisionValue = Math.pow(10, tokenMetadata.decimals);
  const amount = value / divisionValue;

  const erc20CreditDebitDB: Instance = bind(ERC20Table);

  let erc20Table: IERC20Table = await erc20CreditDebitDB.findOne({
    id: uniqueId,
  });

  erc20Table ??= await erc20CreditDebitDB.create({
    id: uniqueId,
    address: address,
    counterPartyAddress: counterPartyAddress,
    tokenAddress: log.log_address,
    tokenName: tokenMetadata.tokenName,
    tokenSymbol: tokenMetadata.tokenSymbol,
    rawAmount: value,
    rawAmountString: value.toString(),
    amount: amount,
    amountString: amount.toString(),
    transactionHash: transaction.transaction_hash,
    logIndex: log.log_index,
    blockTimestamp: block.block_timestamp,
    blockNumber: block.block_number,
    blockHash: block.block_hash,
  });
};
