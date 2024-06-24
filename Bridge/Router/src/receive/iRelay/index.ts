import { IBind, Instance, IFunctionContext } from "@blockflow-labs/utils";

import { hexToString } from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";

/**
 * @dev Function::iRelay(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const iRelayHandler = async (context: IFunctionContext, bind: IBind) => {
  // Implement your function handler logic for iRelay here
  const { functionParams, transaction, block } = context;
  const { relayData } = functionParams;

  const amount = relayData.amount.toString();
  const srcChain = hexToString(relayData.srcChainId.toString());
  const depositId = relayData.depositId.toString();
  const destToken = relayData.destToken.toString();
  const recipient = relayData.recipient.toString();

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

  const id = `${dstChain}_${transaction.transaction_hash}_${depositId}`;

  const destObj: any = {
    id: id.toLowerCase(),
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: dstChain,
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
    destObj["srcRef"] = { recordRef: srcRecord._id };
  }
  await transferDB.save(destObj);

  if (srcRecord) {
    const savedDest = await transferDB.findOne({
      id,
    });
    srcRecord["destRef"] = { recordRef: savedDest._id };
    await sourceDB.save(srcRecord);
  }
};
