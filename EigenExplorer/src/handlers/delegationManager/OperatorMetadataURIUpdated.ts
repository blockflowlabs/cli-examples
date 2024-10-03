import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IOperator, Operator, Stats } from "../../types/schema";
import {
  fetchWithTimeout,
  updateStats,
  validateMetadata,
} from "../../utils/helpers";

/**
 * @dev Event::OperatorMetadataURIUpdated(address operator, string metadataURI)
 * @param context trigger object with contains {event: {operator ,metadataURI }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorMetadataURIUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for OperatorMetadataURIUpdated here

  const { event, transaction, block, log } = context;
  const { operator, metadataURI } = event;

  const operatorDb: Instance = bind(Operator);

  const operatorData = await operatorDb.findOne({ id: operator.toLowerCase() });

  const response = await fetchWithTimeout(metadataURI);
  const isMetadataFetched = response ? response.status === 200 : false;
  const data = response ? JSON.stringify(response.data) : "";
  const operatorMetadata = validateMetadata(data);

  if (!operatorData) {
    const statsDb: Instance = bind(Stats);

    await operatorDb.create({
      metadataURI,
      id: operator.toLowerCase(),
      metadataName: operatorMetadata?.name,
      metadataDescription: operatorMetadata?.description,
      metadataLogo: operatorMetadata?.logo,
      metadataWebsite: operatorMetadata?.website,
      metadataTelegram: operatorMetadata?.telegram,
      metadataX: operatorMetadata?.x,
      metadataDiscord: operatorMetadata?.discord,
      isMetadataSynced: isMetadataFetched,
      address: operator.toLowerCase(),
      avsRegistrations: [],
      shares: [],
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
    await updateStats(statsDb, "totalRegisteredOperators", 1);
  } else {
    operatorData.metadataURI = metadataURI;
    operatorData.metadataName = operatorMetadata?.name;
    operatorData.metadataDescription = operatorMetadata?.description;
    operatorData.metadataLogo = operatorMetadata?.logo;
    operatorData.metadataWebsite = operatorMetadata?.website;
    operatorData.metadataTelegram = operatorMetadata?.telegram;
    operatorData.metadataX = operatorMetadata?.x;
    operatorData.metadataDiscord = operatorMetadata?.discord;
    operatorData.isMetadataSynced = isMetadataFetched;
    operatorData.updatedAt = block.block_timestamp;
    operatorData.updatedAtBlock = block.block_number;

    await operatorDb.save(operatorData);
  }
};
