import { ABind } from "@blockflow-labs/utils";

import { UserOperation } from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const useropHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { userop } = request.query;
  const IUserOp = bind(UserOperation);
  response = {
    userOps: await IUserOp.find({ id: userop.toLowerCase() }),
  };

  return response;
};
