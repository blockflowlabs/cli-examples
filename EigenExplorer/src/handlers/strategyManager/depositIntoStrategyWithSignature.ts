import { IFunctionContext, IBind, ISecrets } from "@blockflow-labs/utils";
import { DepositHandler } from "./Deposit";
import { getEventPayload } from "../../utils/helpers";

/**
 * @dev Function::depositIntoStrategyWithSignature(address strategy, address token, uint256 amount, address staker, uint256 expiry, bytes signature)
 * @param context trigger object with contains {functionParams: {strategy ,token ,amount ,staker ,expiry ,signature }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const depositIntoStrategyWithSignatureHandler = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your function handler logic for depositIntoStrategyWithSignature here

  const { functionParams, transaction, block } = context;
  const { strategy, token, amount, staker, expiry, signature } = functionParams;

  const logs = transaction.logs;

  const depositTopic0 = "0x7cfff908a4b583f36430b25d75964c458d8ede8a99bd61be750e97ee1b2f3a96";
  const depositEventLog = logs.filter((log) => log.topics[0] === depositTopic0)[0];

  const decodedDepositEvent = getEventPayload(
    depositEventLog,
    "Deposit(address staker,address token,address strategy,uint256 shares)",
  );

  const eventContext = {
    event: { ...decodedDepositEvent, amount },
    transaction,
    block,
    log: depositEventLog,
  };

  await DepositHandler(eventContext, bind, secrets);
};
