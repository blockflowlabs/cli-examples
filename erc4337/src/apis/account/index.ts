import { ABind } from "@blockflow-labs/utils";
import { Account, UserOperation } from "../../types/schema";
/**
 * @dev API
 * @param context object containing the response and request object
 * @param bind init function for database wrapper methods
 */
export const accountHandler = async (context: any, bind: ABind) => {
  // Implement your function handler logic for API here

  let { request, response } = context;

  // request contains query object. To access user query params use
  let { account } = request.query;

  account = account.toString();

  const IPaymaster = bind(Account);
  const IUserOp = bind(UserOperation);

  let accountData: any = await IPaymaster.find({
    id: account.toLowerCase(),
  });

  response = {
    paymaster: accountData[0],
    userOps: [],
  };

  for (let ops of accountData[0].ops) {
    response.userOps.push(...(await IUserOp.find({ id: ops.toLowerCase() })));
  }

  return response;
};
