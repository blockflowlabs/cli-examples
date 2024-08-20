import { ABind, API } from "@blockflow-labs/utils";

import { domainToChainId } from "../utils/helper";
import { burnTransactionsTable } from "../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const countHandler = async (context: any, bind: ABind) => {
  let { request, response } = context;

  let { source, destination, pending, timestamp } = request.query;
  const sourceParsed = JSON.parse(source);
  const destinationParsed = JSON.parse(destination);
  const chainIds = sourceParsed.map((src: any) => domainToChainId[src]);

  const srcDb: API = bind(burnTransactionsTable);

  const matchStage: any = {
    destinationDomain: { $in: destinationParsed },
    entityId:
      pending === "true" ? "burnTransactionsTable" : "mintTransactionsTable",
  };

  if (pending !== "true") matchStage.sourceDomain = { $in: sourceParsed };
  else matchStage.chainId = { $in: chainIds };

  if (timestamp) matchStage.timeStamp = { $gt: timestamp };

  const pipeline = [{ $match: matchStage }, { $count: "count" }];

  response = await srcDb.aggregate(pipeline);

  return response;
};
