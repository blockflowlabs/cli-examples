import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { avoData, IavoData } from "../types/schema";
import { getAllTransactionActions } from "../utils";

/**
 * @dev Event::Executed(address avoSafeOwner, address avoSafeAddress, address source, bytes metadata)
 * @param context trigger object with contains {event: {avoSafeOwner ,avoSafeAddress ,source ,metadata }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ExecutedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  const { avoSafeOwner, avoSafeAddress, source, metadata } = event;

  const avoDataDB: Instance = bind(avoData);
  const id = transaction.transaction_hash + ":" + log.log_index.toString();

  const actions = getAllTransactionActions(transaction.logs);

  await avoDataDB.create({
    id: id,
    transactionHash: transaction.transaction_hash,
    broadcaster: transaction.transaction_from_address,
    status: "Success",
    time: block.block_timestamp.toString(),
    network: "ETH",
    actions,
    user: avoSafeOwner,
    avocadoWallet: avoSafeAddress,
  });
};
