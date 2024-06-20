import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import{ avoData,IavoData } from "../../types/schema";
import { fromTwos } from "ethers";

/**
 * @dev Event::AdminChanged(address previousAdmin, address newAdmin)
 * @param context trigger object with contains {event: {previousAdmin ,newAdmin }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AdminChangedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for AdminChanged here

  const { event, transaction, block, log } = context;
  const { previousAdmin, newAdmin } = event;

  const avoDataDB: Instance = bind(avoData);
  const id = transaction.transaction_hash + log.log_index.toString();
  const transferTopic0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
  const transferlog = transaction.logs
  ? transaction.logs.find(
    (log) =>
      log.topics[0].toLowerCase() === transferTopic0.toLowerCase()
  )
  :null;

  let data: IavoData = await avoDataDB.findOne({
    id:id
  });

  data ??= await avoDataDB.create({
    id: id,
    transactionHash: transaction.transaction_hash,
    broadcaster: newAdmin,
    status: "Success",
    time: block.block_timestamp.toString(),
    network: "ETH",
    transactionActionamount: transferlog?.log_data,
    transactionActionTo: transferlog?.topics[2],
    user: event.topics[0],
    avocadoWallet: event.topics[1]
  });
};
