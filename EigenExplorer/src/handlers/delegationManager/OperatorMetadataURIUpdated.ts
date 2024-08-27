import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IOperator, Operator } from "../../types/schema";

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

  if (!operatorData) {
    await operatorDb.create({
      id: operator.toLowerCase(),
      address: operator.toLowerCase(),
      metadataURI,
      strategies: [],
      shares: [],
      createdAt: block.block_timestamp,
      updatedAt: block.block_timestamp,
      createdAtBlock: block.block_number,
      updatedAtBlock: block.block_number,
    });
  } else {
    operatorData.metadataURI = metadataURI;
    operatorData.updatedAt = block.block_timestamp;
    operatorData.updatedAtBlock = block.block_number;
    await operatorDb.updateOne({ id: operator.toLowerCase() }, operatorData);
  }
};
