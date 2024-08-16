import {
  IBind,
  Instance,
  IFunctionContext,
  IEventContext,
} from "@blockflow-labs/utils";

import { EventNameEnum, hexToString } from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";
import { TransactionType } from "../../utils/gql-filters-type";

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

  let destObj: any = {
    id: id.toLowerCase(),
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: dstChain,
    eventName: EventNameEnum.Execute,
    type: TransactionType.AssetBridge,
    transactionHash: transaction.transaction_hash,
    destinationToken: tokenPath.destinationToken,
    stableToken: tokenPath.stableToken,
    recipientAddress: recipient, // Contract from where txn came
    receiverAddress: recipient,
    depositId: depositId,
    srcChainId: srcChain,
  };
  const sourceDB: Instance = bind(Source);
  const srcRecord: any = await sourceDB.findOne({
    id: `${srcChain}_${dstChain}_${depositId}`,
  });
  if (srcRecord) {
    destObj["source"] = { recordRef: srcRecord._id };
  }
  await transferDB.save(destObj);

  if (srcRecord) {
    const savedDest = await transferDB.findOne({
      id,
    });
    srcRecord["destination"] = { recordRef: savedDest._id };
    await sourceDB.save(srcRecord);
  }
};
