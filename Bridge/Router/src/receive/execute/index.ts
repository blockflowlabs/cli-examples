import {
  IBind,
  Instance,
  IFunctionContext,
  IEventContext,
} from "@blockflow-labs/utils";

import { EventNameEnum, hexToString } from "../../utils/helper";
import { Destination } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";

/**
 * @dev Function::iRelay(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const executeHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your function handler logic for iRelay here
  const { event, transaction, block } = context;
  let {
    sourceChainIdBytes,
    depositNonce,
    settlementToken,
    settlementAmount,
    recipient,
  } = event;
  const amount = settlementAmount.toString();
  const srcChain = hexToString(sourceChainIdBytes.toString());
  const depositId = depositNonce.toString();
  const destToken = settlementToken.toString();
  recipient = recipient.toString();

  const dstChain = block.chain_id;
  const transferDB: Instance = bind(Destination);

  const tokenInfo = await fetchTokenDetails(bind, dstChain, destToken);

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

  const id = `${dstChain}_${transaction.transaction_hash}`;

  await transferDB.save({
    id: id.toLowerCase(),
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: dstChain,
    eventName: EventNameEnum.Execute,
    transactionHash: transaction.transaction_hash,
    destinationToken: tokenPath.destinationToken,
    stableToken: tokenPath.stableToken,
    recipientAddress: recipient, // Contract from where txn came
    receiverAddress: recipient,
    depositId: depositId,
    srcChainId: srcChain,
  });
};
