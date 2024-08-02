import { ABind, API } from "@blockflow-labs/utils";

import { mintTransactionsTable } from "../types/schema";
import { domainToChainId } from "../utils/helper";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const flowHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { timestamp, chainId } = request.query;

  const srcDb: API = bind(mintTransactionsTable);

  const domains = ["0", "1", "2", "3", "6", "7"]; // Example destination domains array

  const matchStage: any = {
    sourceDomain: { $in: domains },
    destinationDomain: { $in: domains },
    entityId: "mintTransactionsTable",
  };

  if (timestamp) matchStage.timeStamp = { $gt: timestamp };
  if (chainId) matchStage.chainId = chainId;

  const result = await srcDb.aggregate([
    {
      $match: matchStage,
    },
    {
      $group: {
        _id: {
          sourceDomain: "$sourceDomain",
          destinationDomain: "$destinationDomain",
        },
        totalAmount: { $sum: "$amount" },
        count: { $sum: 1 }, // Add count of documents
      },
    },
    {
      $project: {
        _id: 0,
        sourceChain: "$_id.sourceDomain",
        destinationChain: "$_id.destinationDomain",
        totalAmount: 1,
        count: 1, // Include count in the projection
      },
    },
  ]);

  const mappedResult = result.map((entry) => ({
    sourceChain: domainToChainId[entry.sourceChain],
    destinationChain: domainToChainId[entry.destinationChain],
    totalAmount: entry.totalAmount,
    count: entry.count,
  }));

  return mappedResult;
};
