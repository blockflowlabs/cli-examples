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
  
  const uniqueIdcredit = `${transaction.transaction_hash}-${log.log_index}-"credit"`;
  const uniqueIddebit = `${transaction.transaction_hash}-${log.log_index}-"debit"`;
  const address = from.toString();
  const counterPartyAddress = to.toString();
  // const divisionValue = Math.pow(10, tokenMetadata.decimals);
  // const amount = value / divisionValue;
  // const debitamount =  amount * -1;
  const decimalsBigNumber = new BigNumber(tokenMetadata.decimals);
  const divisionValue = new BigNumber(10).pow(decimalsBigNumber);
  const valueBigNumber = new BigNumber(value.toString());
  const amount = valueBigNumber.dividedBy(divisionValue).toString();
  const debitAmount = valueBigNumber.dividedBy(divisionValue).times(-1).toString();

  const erc20CreditDebitDB: Instance = bind(ERC20Table);

  let erc20Table: IERC20Table = await erc20CreditDebitDB.findOne({
    id: uniqueIdcredit,
  });

  erc20Table ??= await erc20CreditDebitDB.create({
    id: uniqueIdcredit,
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

   let erc20TableDebit: IERC20Table = await erc20CreditDebitDB.findOne({
     id: uniqueIddebit,
   });

  erc20TableDebit ??= await erc20CreditDebitDB.create({
    id: uniqueIddebit,
    address: counterPartyAddress,
    counterPartyAddress: address,
    tokenMetadata: log.log_address,
    tokenName: tokenMetadata.tokenName,
    tokenSymbol: tokenMetadata.tokenSymbol,
    amount: debitAmount,
    amountString: debitAmount.toString(),
    transactionHash: transaction.transaction_hash, 
    logIndex: log.log_index,
    blockTimestamp: block.block_timestamp,
    blockNumber: block.block_number,
    blockHash: block.block_hash,
  })
};
