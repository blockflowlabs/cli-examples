import { ABind } from "@blockflow-labs/utils";
import { mintTransactionsTable, burnTransactionsTable } from "../types/schema";

interface QueryParams {
  chainId?: string;
  type?: string;
  timestamp?: string;
}

interface Context {
  request: {
    query: QueryParams;
  };
  response: any;
}

const LIMIT = 10;

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const userHandler = async (context: Context, bind: ABind) => {
  const { request, response } = context;
  const { chainId, type, timestamp } = request.query;

  const getMatchStage = (entityId: string) => {
    const matchStage: any = { entityId };
    if (chainId) matchStage.chainId = chainId;
    if (timestamp) matchStage.timeStamp = { $gt: timestamp };
    return matchStage;
  };

  if (type === "in") {
    const dstDB = bind(mintTransactionsTable);
    const matchStageIn = getMatchStage("mintTransactionsTable");

    const [volume, count] = await Promise.all([
      dstDB.aggregate(
        getAggregationPipelineForVolume(matchStageIn, "mintRecipient")
      ),
      await dstDB.aggregate(
        getAggregationPipelineForTxCount(matchStageIn, "mintRecipient")
      ),
    ]);

    response.volume = volume;
    response.count = count;
  } else if (type === "out") {
    const srcDB = bind(burnTransactionsTable);
    const matchStageOut = getMatchStage("burnTransactionsTable");
    const [volume, count] = await Promise.all([
      srcDB.aggregate(
        getAggregationPipelineForVolume(matchStageOut, "messageSender")
      ),
      await srcDB.aggregate(
        getAggregationPipelineForTxCount(matchStageOut, "messageSender")
      ),
    ]);

    response.volume = volume;
    response.count = count;
  }

  return response;
};

const getAggregationPipelineForVolume = (
  matchStage: any,
  groupByField: string
): any => [
  { $match: matchStage },
  {
    $group: {
      _id: `$${groupByField}`,
      totalAmount: { $sum: "$amount" },
      chainId: { $first: "$chainId" },
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      [groupByField]: "$_id",
      totalAmount: 1,
      chainId: 1,
      count: 1,
    },
  },
  { $sort: { totalAmount: -1 } },
  { $limit: LIMIT },
];

const getAggregationPipelineForTxCount = (
  matchStage: any,
  groupByField: string
): any => [
  { $match: matchStage },
  {
    $group: {
      _id: `$${groupByField}`,
      chainId: { $first: "$chainId" },
      count: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      [groupByField]: "$_id",
      chainId: 1,
      count: 1,
    },
  },
  { $sort: { count: -1 } },
  { $limit: LIMIT },
];
