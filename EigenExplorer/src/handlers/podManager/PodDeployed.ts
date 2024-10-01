import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { EigenPod } from "../../types/schema";

/**
 * @dev Event::PodDeployed(address eigenPod, address podOwner)
 * @param context trigger object with contains {event: {eigenPod ,podOwner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PodDeployedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for PodDeployed here

  const { event, transaction, block, log } = context;
  const { eigenPod, podOwner } = event;

  const podDb: Instance = bind(EigenPod);

  const podData = await podDb.findOne({
    id: eigenPod.toLowerCase(),
  });

  if (!podData) {
    await podDb.create({
      id: eigenPod.toLowerCase(),
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
