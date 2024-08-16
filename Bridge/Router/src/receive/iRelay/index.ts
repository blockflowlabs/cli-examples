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
  const destinationDB: Instance = bind(Destination);

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

  const savedDest = await destinationDB.findOne({
    transactionHash: transaction.transaction_hash,
  });

  const destObj: any = {
    recipientAddress: recipient,
    receiverAddress: recipient,
    stableToken: tokenPath.stableToken,
    destinationToken: tokenPath.destinationToken,
    depositId: depositId,
    srcChainId: srcChain,
  };
  destObj["id"] = savedDest.id;

  const sourceDB: Instance = bind(Source);
  const srcRecord: any = await sourceDB.findOne({
    //Src Record Id
    id: `${srcChain}_${dstChain}_${depositId}`,
  });

  if (srcRecord) {
    destObj["source"] = { recordRef: srcRecord?._id };
  }
  await destinationDB.save(destObj);

  if (srcRecord) {
    srcRecord["destination"] = { recordRef: savedDest._id };
    await sourceDB.save(srcRecord);
  }
};
