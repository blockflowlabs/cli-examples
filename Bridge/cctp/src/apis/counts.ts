import { ABind, API } from "@blockflow-labs/utils";

import { burnTransactionsTable } from "../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const countHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here
  let { request, response } = context;

  // request contains query object. To access user query params use
  let { source, destination } = request.query;
  const srcDb: API = bind(burnTransactionsTable);

  const pipeline = [
    {
      $match: {
        sourceDomain: { $in: JSON.parse(source) },
        destinationDomain: { $in: JSON.parse(destination) },
      },
    },
    {
      $count: "count",
    },
  ];

  response = await srcDb.aggregate(pipeline);

  return response;
};
