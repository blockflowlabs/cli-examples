import {
  IBind,
  Instance,
  IFunctionContext,
  IEventContext,
} from "@blockflow-labs/utils";

import {
  decodeSwapWithRecipient,
  EventNameEnum,
  hexToString,
  SWAP_WITH_RECIPIENT_TOPIC0,
} from "../../utils/helper";
import { Destination } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";

/**
 * @dev Function::iRelay(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const executeWithMessageHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  // Implement your function handler logic for iRelay here
  const { event, transaction, block } = context;
  let {
    sourceChainIdBytes,
    depositNonce,
    settlementToken,
    settlementAmount,
    recipient,
    flag,
    data,
  } = event;
  const amount = settlementAmount.toString();
  const srcChain = hexToString(sourceChainIdBytes.toString());
  const depositId = depositNonce.toString();
  const destToken = settlementToken.toString();
  recipient = recipient.toString();
  const execFlag = flag;
  const execData = data.toString();
  let receiverAddress = null;

  const dstChain = "8453"; //block.chain_id;

  const transferDB: Instance = bind(Destination);

  const tokenInfo = await fetchTokenDetails(bind, dstChain, destToken);
  console.log("tokenInfo", tokenInfo);
  let tokenPath = {
    destinationToken: {
      tokenRef: tokenInfo._id,
      amount: formatDecimals(amount, tokenInfo.decimals.toString()),
    },
    stableToken: {
      tokenRef: tokenInfo._id,
      amount: formatDecimals(amount, tokenInfo.decimals.toString()),
    },
  };

  const isSwapWithReceiptRelay = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === SWAP_WITH_RECIPIENT_TOPIC0
      )
    : null;

  if (isSwapWithReceiptRelay) {
    const decodeEvent: any = decodeSwapWithRecipient(isSwapWithReceiptRelay);
    const [_stableToken, destToken] = decodeEvent[1];
    const destTokenInfo = await fetchTokenDetails(bind, dstChain, destToken);
    receiverAddress = decodeEvent[4];
    // prettier-ignore
    const [_amountIn, amountOut] = [decodeEvent[2].toString(), decodeEvent[5].toString()]
    tokenPath["destinationToken"] = {
      tokenRef: destToken._id,
      amount: formatDecimals(amountOut, destTokenInfo.decimals),
    };
  }

  const id = `${dstChain}_${transaction.transaction_hash}`;

  await transferDB.save({
    id: id.toLowerCase(),
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: dstChain,
    eventName: EventNameEnum.ExecuteWithMessage,
    transactionHash: transaction.transaction_hash,
    destinationToken: tokenPath.destinationToken,
    stableToken: tokenPath.stableToken,
    recipientAddress: recipient, // Contract from where txn came
    receiverAddress: receiverAddress ?? recipient,
    depositId: depositId,
    srcChainId: srcChain,
    execData,
    execFlag,
  });
};
