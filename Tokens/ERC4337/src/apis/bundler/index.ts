import { ABind } from "@blockflow-labs/utils";
import { Bundler, UserOperation } from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const bundlerHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { bundler } = request.query;

  bundler = bundler.toString();

  const IBundler = bind(Bundler);
  const IUserOp = bind(UserOperation);

  let bundlerData: any = await IBundler.find({
    id: bundler.toLowerCase(),
  });

  response = {
    bundler: bundlerData[0],
    userOps: [],
  };

  for (let ops of bundlerData[0].ops) {
    response.userOps.push(...(await IUserOp.find({ id: ops.toLowerCase() })));
  }

  return response;
};
