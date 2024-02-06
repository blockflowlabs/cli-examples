import { ABind } from "@blockflow-labs/utils";
import { Paymaster, UserOperation } from "../../types/schema";

/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const paymasterHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { paymaster } = request.query;
  paymaster = paymaster.toString();

  const IPaymaster = bind(Paymaster);
  const IUserOp = bind(UserOperation);

  let paymasterData: any = await IPaymaster.find({
    id: paymaster.toLowerCase(),
  });

  response = {
    paymaster: paymasterData[0],
    userOps: [],
  };

  for (let ops of paymasterData[0].ops) {
    response.userOps.push(...(await IUserOp.find({ id: ops.toLowerCase() })));
  }

  return response;
};
