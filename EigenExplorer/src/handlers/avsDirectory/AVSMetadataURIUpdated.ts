import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { AVS, Stats } from "../../types/generated";
import { fetchWithTimeout, validateMetadata, updateStats } from "../../utils/helpers";
/**
 * @dev Event::AVSMetadataURIUpdated(address avs, string metadataURI)
 * @param context trigger object with contains {event: {avs ,metadataURI }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const AVSMetadataURIUpdatedHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for AVSMetadataURIUpdated here

  const { event, transaction, block, log } = context;
  const { avs, metadataURI } = event;

  const client = Instance.PostgresClient(bind);
  const avsDb = client.db(AVS);

  const avsData = await avsDb.load({ address: avs.toLowerCase() });

  const response = await fetchWithTimeout(metadataURI);
  const isMetadataFetched = response ? response.status === 200 : false;
  const data = response ? JSON.stringify(response.data) : "";
  const avsMetadata = validateMetadata(data);

  if (avsData) {
    avsData.metadataURI = metadataURI;
    avsData.metadataName = avsMetadata?.name;
    avsData.metadataDescription = avsMetadata?.description;
    avsData.metadataLogo = avsMetadata?.logo;
    avsData.metadataWebsite = avsMetadata?.website;
    avsData.metadataTelegram = avsMetadata?.telegram;
    avsData.metadataX = avsMetadata?.x;
    avsData.metadataDiscord = avsMetadata?.discord;
    avsData.isMetadataSynced = isMetadataFetched;
    avsData.updatedAt = block.block_timestamp;
    avsData.updatedAtBlock = block.block_number;

    await avsDb.save(avsData);
  } else {
    await avsDb.save({
      metadataURI,
      metadataName: avsMetadata?.name,
      metadataDescription: avsMetadata?.description,
      metadataLogo: avsMetadata?.logo,
      metadataWebsite: avsMetadata?.website,
      metadataTelegram: avsMetadata?.telegram,
      metadataX: avsMetadata?.x,
      metadataDiscord: avsMetadata?.discord,
      isMetadataSynced: isMetadataFetched,
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

  const statsDb = client.db(Stats);

  await updateStats(statsDb, "totalRegisteredAvs", 1, "add");
};
