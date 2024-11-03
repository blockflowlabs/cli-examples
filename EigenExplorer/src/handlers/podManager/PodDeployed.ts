import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { EigenPod } from "../../types/generated";

/**
 * @dev Event::PodDeployed(address eigenPod, address podOwner)
 * @param context trigger object with contains {event: {eigenPod ,podOwner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PodDeployedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for PodDeployed here

  const { event, transaction, block, log } = context;
  const { eigenPod, podOwner } = event;

  const client = Instance.PostgresClient(bind);

  const podDb = client.db(EigenPod);

  const podData = await podDb.load({
    address: eigenPod.toLowerCase(),
  });

  if (!podData) {
    await podDb.save({
      address: eigenPod.toLowerCase(),
      owner: podOwner.toLowerCase(),
      createdAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAt: block.block_timestamp,
      updatedAtBlock: block.block_number,
    });
  } else {
    podData.owner = podOwner.toLowerCase();
    podData.updatedAt = block.block_timestamp;
    podData.updatedAtBlock = block.block_number;
    await podDb.save(podData);
  }
};
