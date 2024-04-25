import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { BigNumber } from "bignumber.js";
import { TOKENS } from "../utils/tokens";
import { ITransfer, Transfer } from "../types/schema";

export const TransferHandler = async (
  { event, transaction, block, log }: IEventContext,
  bind: IBind,
  _: ISecrets
) => {
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const tokenAddress = log.log_address.toString().toLowerCase();
  const token = TOKENS[tokenAddress];

  const fromAddress = event.from.toString().toLowerCase();
  const toAddress = event.to.toString().toLowerCase();

  const tokenDecimals = parseInt(token.decimals.toString());
  const amount = new BigNumber(event.value.toString()).dividedBy(
    10 ** tokenDecimals
  );

  let transferType = "";
  if (fromAddress === zeroAddress) transferType = "mint";
  else if (toAddress === zeroAddress) transferType = "burn";
  else transferType = "transfer";

  const uniqueId = `${transaction.transaction_hash.toString()}:${log.log_index.toString()}`;

  const transferDB: Instance = bind(Transfer);
  let transfer: ITransfer = await transferDB.findOne({ id: uniqueId });

  if (!transfer) {
    transfer = await transferDB.create({
      id: uniqueId.toLowerCase(),
      from_address: fromAddress,
      to_address: toAddress,
      token_address: tokenAddress,
      token_name: token.name,
      token_symbol: token.symbol,
      raw_amount: Number(event.value),
      raw_amount_str: event.value.toString(),
      amount: Number(amount),
      amount_str: amount,
      usd_amount: Number(event.value),
      usd_exchange_rate: event.value.toString(),
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
  }

  await transferDB.save(transfer);
};
