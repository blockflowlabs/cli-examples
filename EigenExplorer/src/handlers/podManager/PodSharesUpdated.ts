import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { PodTransactions } from "../../types/generated";

/**
 * @dev Event::PodSharesUpdated(address podOwner, int256 sharesDelta)
 * @param context trigger object with contains {event: {podOwner ,sharesDelta }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PodSharesUpdatedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for PodSharesUpdated here

  const { event, transaction, block, log } = context;
  const { podOwner, sharesDelta } = event;

  const id = `${podOwner}_${transaction.transaction_hash}`;

  const client = Instance.PostgresClient(bind);
  const podSharesUpdatedDb = client.db(PodTransactions);

  const podSharesUpdatedData = await podSharesUpdatedDb.load({
    rowId: id,
  });

  if (!podSharesUpdatedData) {
    await podSharesUpdatedDb.save({
      rowId: id,
      podAddress: transaction.transaction_to_address.toLowerCase(),
      podOwner: podOwner.toLowerCase(),
      sharesDelta: sharesDelta.toString(),
      transactionHash: transaction.transaction_hash,
      transactionIndex: transaction.transaction_index,
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
    });
  } else {
    podSharesUpdatedData.sharesDelta = sharesDelta.toString();
    podSharesUpdatedData.transactionIndex = transaction.transaction_index;
    podSharesUpdatedData.podAddress = transaction.transaction_to_address.toLowerCase();
    podSharesUpdatedData.updatedAt = block.block_timestamp;
    podSharesUpdatedData.updatedAtBlock = block.block_number;
    await podSharesUpdatedDb.save(podSharesUpdatedData);
  }
};
