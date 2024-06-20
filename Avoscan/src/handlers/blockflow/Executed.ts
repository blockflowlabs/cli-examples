import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

import { avoData, IavoData } from "../../types/schema"
import { fromTwos } from "ethers"

/**
 * @dev Event::Executed(address avoSafeOwner, address avoSafeAddress, address source, bytes metadata)
 * @param context trigger object with contains {event: {avoSafeOwner ,avoSafeAddress ,source ,metadata }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ExecutedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context
  const { avoSafeOwner, avoSafeAddress, source, metadata } = event

  const avoDataDB: Instance = bind(avoData)
  const id = transaction.transaction_hash + log.log_index.toString()
  const transferTopic0 =
    "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
  const transferlog = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === transferTopic0.toLowerCase(),
      )
    : null

  let data: IavoData = await avoDataDB.findOne({
    id: id,
  })

  data ??= await avoDataDB.create({
    id: id,
    transactionHash: transaction.transaction_hash,
    broadcaster: transaction.transaction_from_address,
    status: "Success",
    time: block.block_timestamp.toString(),
    network: "ETH",
    actions: [
      transferlog?.log_data,
      transferlog?.topics[2],
      transferlog?.topics[1],
    ],
    user: avoSafeOwner,
    avocadoWallet: avoSafeAddress,
  })
}
