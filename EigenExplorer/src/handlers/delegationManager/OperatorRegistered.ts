import { IEventContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { Instance } from "@blockflow-labs/sdk";
import { Operator, Stats, OperatorHistory } from "../../types/generated";
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

  const client = Instance.PostgresClient(bind);

  const operatorDb = client.db(Operator);
  const statsDb = client.db(Stats);
  const operatorHistoryDb = client.db(OperatorHistory);

  await operatorDb.save({
    address: operator.toLowerCase(),
    details: [
      {
        earningsReceiver,
        delegationApprover,
        stakerOptOutWindowBlocks: Number(stakerOptOutWindowBlocks),
      },
    ],
    metadataURI: "",
    isMetadataSynced: false,
    avsRegistrations: [],
    totalStakers: 0,
    totalAvs: 0,
    createdAt: block.block_timestamp,
    updatedAt: block.block_timestamp,
    createdAtBlock: block.block_number,
    updatedAtBlock: block.block_number,
  });

  const operatorHistoryId = `${operator}_${transaction.transaction_hash}`.toLowerCase();

  await operatorHistoryDb.save({
    rowId: operatorHistoryId,
    operatorAddress: operator.toLowerCase(),
    avsAddress: "",
    event: "operatorRegistered",
    transactionHash: transaction.transaction_hash,
    createdAt: block.block_timestamp,
    createdAtBlock: block.block_number,
  });

  await updateStats(statsDb, "totalRegisteredOperators", 1);
};
