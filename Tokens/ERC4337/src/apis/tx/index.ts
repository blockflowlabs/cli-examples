import { ABind } from "@blockflow-labs/utils";

import { Transaction } from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const txHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { tx } = request.query;

  const ITransaction = bind(Transaction);

  response = {
    tx: await ITransaction.find({ id: tx.toLowerCase() }),
  };

  return response;
};
