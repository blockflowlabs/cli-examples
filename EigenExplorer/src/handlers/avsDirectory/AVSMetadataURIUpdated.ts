import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { AVS } from "../../types/schema";
/**
 * @dev Event::AVSMetadataURIUpdated(address avs, string metadataURI)
 * @param context trigger object with contains {event: {avs ,metadataURI }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AVSMetadataURIUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for AVSMetadataURIUpdated here

  const { event, transaction, block, log } = context;
  const { avs, metadataURI } = event;

  const avsDb: Instance = bind(AVS);

  const avsData = await avsDb.findOne({ id: avs.toLowerCase() });

  if (avsData) {
    avsData.metadataURI = metadataURI;
    avsData.updatedAt = block.block_timestamp;
    avsData.updatedAtBlock = block.block_number;
    await avsDb.save(avsData);
  } else {
    await avsDb.create({
      metadataURI,
      id: avs.toLowerCase(),
      address: avs.toLowerCase(),
      activeOperators: [],
      inactiveOperators: [],
      totalOperators: 0,
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  }
};
