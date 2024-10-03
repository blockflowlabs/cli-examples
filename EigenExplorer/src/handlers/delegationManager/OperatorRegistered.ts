import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils";
import { Operator, Stats } from "../../types/schema";
import { updateStats } from "../../utils/helpers";

/**
 * @dev Event::OperatorRegistered(address operator, tuple operatorDetails)
 * @param context trigger object with contains {event: {operator ,operatorDetails }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorRegisteredHandler = async (context: IEventContext, bind: IBind, secrets: ISecrets) => {
  // Implement your event handler logic for OperatorRegistered here

  const { event, transaction, block, log } = context;
  const { operator, operatorDetails } = event;

  const { earningsReceiver, delegationApprover, stakerOptOutWindowBlocks } = operatorDetails;

  const operatorDb: Instance = bind(Operator);
  const statsDb: Instance = bind(Stats);

  await operatorDb.create({
    id: operator.toLowerCase(),
    address: operator.toLowerCase(),
    details: {
      earningsReceiver,
      delegationApprover,
      stakerOptOutWindowBlocks: Number(stakerOptOutWindowBlocks),
    },
    metadataURI: "",
    isMetadataSynced: false,
    avsRegistrations: [],
    totalStakers: 0,
    createdAt: block.block_timestamp,
    updatedAt: block.block_timestamp,
    createdAtBlock: block.block_number,
    updatedAtBlock: block.block_number,
  });

  await updateStats(statsDb, "totalRegisteredOperators", 1);
};
