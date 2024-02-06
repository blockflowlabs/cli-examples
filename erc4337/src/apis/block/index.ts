import { ABind } from "@blockflow-labs/utils";

import { Block } from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const blockHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { block } = request.query;

  const IBlock = bind(Block);

  response = {
    block: await IBlock.find({ id: block.toLowerCase() }),
  };

  return response;
};
