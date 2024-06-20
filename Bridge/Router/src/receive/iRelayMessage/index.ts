import { IBind, Instance, IFunctionContext } from "@blockflow-labs/utils";

import {
  hexToString,
  SWAP_WITH_RECIPIENT_TOPIC0,
  decodeSwapWithRecipient,
  decodeGasLeaked,
  GASLEAKED_TOPIC0,
} from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";

/**
 * @dev Function::iRelayMessage(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const iRelayMessageHandler = async (context: IFunctionContext, bind: IBind) => {
  // Implement your function handler logic for iRelayMessage here
  const { functionParams, transaction, block } = context;
  const { relayData } = functionParams;

  const amount = relayData.amount.toString();
  const srcChain = hexToString(relayData.srcChainId.toString());
  const depositId = relayData.depositId.toString();
  const destToken = relayData.destToken.toString();
  const recipient = relayData.recipient.toString();

  const dstChain = block.chain_id;
  const transferDB: Instance = bind(Destination);
  const stableTokenInfo = await fetchTokenDetails(bind, dstChain, destToken);

  let tokenPath = {
    stableToken: {
      tokenRef: stableTokenInfo._id,
      amount: formatDecimals(amount, stableTokenInfo.decimals),
    },
    destinationToken: {
      tokenRef: stableTokenInfo._id,
      amount: formatDecimals(amount, stableTokenInfo.decimals),
    },
  };

  let receiverAddress = null,
    nativeTokenAmount = null;

  const id = `${dstChain}_${transaction.transaction_hash}`;

  const isSwapWithReceiptRelay = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === SWAP_WITH_RECIPIENT_TOPIC0
      )
    : null;

  if (isSwapWithReceiptRelay) {
    // ex tx: https://polygonscan.com/tx/0xa96654d213f548d61ed8d5d827fd596b68f4ec98d074b03a5816d2b7d3d56839
    // fundsPaidWithMessage check if SwapAndDesposit is there
    // tokenPath :
    // 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 stableToken
    // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE destToken

    const decodeEvent: any = decodeSwapWithRecipient(isSwapWithReceiptRelay);
    const [stableToken, destToken] = decodeEvent[1];
    const destTokenInfo = await fetchTokenDetails(bind, dstChain, destToken);
    receiverAddress = decodeEvent[4];
    // prettier-ignore
    const [amountIn, amountOut] = [decodeEvent[2].toString(), decodeEvent[5].toString()]
    tokenPath = {
      stableToken: {
        tokenRef: stableToken._id,
        amount: formatDecimals(amountIn, stableTokenInfo.decimals),
      },
      destinationToken: {
        tokenRef: destToken._id,
        amount: formatDecimals(amountOut, destTokenInfo.decimals),
      },
    };
  }

  const isGasLeaked = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === GASLEAKED_TOPIC0
      )
    : null;

  if (isGasLeaked) {
    // https://basescan.org/tx/0x6da3e396dca98cb736db6ee824ddffc74e0a4fde8b723a71ab84c5adfa4e3842#eventlog
    const decodeEvent: any = decodeGasLeaked(isGasLeaked);
    const destTokenInfo = await fetchTokenDetails(
      bind,
      dstChain,
      decodeEvent[0].toString()
    );
    nativeTokenAmount = formatDecimals(
      decodeEvent[2].toString(),
      destTokenInfo.decimals
    );
    receiverAddress = decodeEvent[3].toString();
  }
  const destObj: any = {
    id: id.toLowerCase(),
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: dstChain,
    transactionHash: transaction.transaction_hash,
    destinationToken: tokenPath.destinationToken,
    stableToken: tokenPath.stableToken,
    recipientAddress: recipient, // Contract from where txn came
    receiverAddress: receiverAddress ?? recipient, // Who received the funds
    nativeTokenAmount: nativeTokenAmount ?? "",
    depositId: depositId,
    srcChainId: srcChain,
  };
  const sourceDB: Instance = bind(Source);
  const srcRecord: any = await sourceDB.findOne({
    id: `${srcChain}_${dstChain}_${depositId}`,
  });
  console.log("srcRecord", srcRecord);
  if (srcRecord) {
    destObj["srcRef"] = { recordRef: srcRecord._id };
  }
  await transferDB.save(destObj);

  if (srcRecord) {
    const savedDest = await transferDB.findOne({
      id,
    });
    console.log("savedDest", savedDest);
    srcRecord["destRef"] = { recordRef: savedDest._id };
    await sourceDB.save(srcRecord);
  }
};
