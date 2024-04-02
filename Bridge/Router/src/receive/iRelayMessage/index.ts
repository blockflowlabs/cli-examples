import { IBind, Instance, IFunctionContext } from "@blockflow-labs/utils";

import {
  hexToString,
  chainToContract,
  stringToHex,
  getTokenInfo,
  hashDepositDataWithMessage,
  SWAP_WITH_RECIPIENT_TOPIC0,
  decodeSwapWithRecipient,
} from "../../utils/helper";
import { Destination } from "../../types/schema";

/**
 * @dev Function::iRelayMessage(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const iRelayMessageHandler = async (
  context: IFunctionContext,
  bind: IBind,
  secrets: Record<string, string>
) => {
  // Implement your function handler logic for iRelayMessage here
  const { functionParams, transaction, block } = context;
  const { relayData } = functionParams;

  const amount = relayData.amount.toString();
  const srcChain = hexToString(relayData.srcChainId.toString());
  const depositId = relayData.depositId.toString();
  const destToken = relayData.destToken.toString();
  const recipient = relayData.recipient.toString();
  const message = relayData.message.toString();

  const dstChain = block.chain_id;
  const transferDB: Instance = bind(Destination);
  const tokenInfo = getTokenInfo(dstChain, destToken);

  let messageHash = "0x";

  try {
    messageHash = hashDepositDataWithMessage({
      amount,
      srcChainId: stringToHex(srcChain),
      depositId,
      destToken,
      recipient,
      contract: chainToContract(dstChain),
      message,
    });
  } catch (error) {}

  let tokenPath = {
    destnationtoken: {
      address: destToken,
      amount: amount,
      symbol: tokenInfo.symbol,
    },
    stableToken: {
      // @todo
      address: destToken,
      amount: amount,
      symbol: tokenInfo.symbol,
    },
  };

  const id = `${srcChain}_${dstChain}_${depositId}_${chainToContract(srcChain)}_${chainToContract(dstChain)}`; // messageHash.toLowerCase()

  const isSwapWithReceiptRelay = transaction.logs.find(
    (log) => log.topics[0].toLowerCase() === SWAP_WITH_RECIPIENT_TOPIC0
  );

  if (isSwapWithReceiptRelay) {
    // ex tx: https://polygonscan.com/tx/0xa96654d213f548d61ed8d5d827fd596b68f4ec98d074b03a5816d2b7d3d56839
    // fundsPaidWithMessage check if SwapAndDesposit is there
    // tokenPath :
    // 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 stableToken
    // 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE destToken

    const decodeEvent: any = decodeSwapWithRecipient(isSwapWithReceiptRelay);
    const [stableToken, destToken] = decodeEvent[1];
    // prettier-ignore
    const [amountIn, amountOut] = [decodeEvent[2].toString(), decodeEvent[5].toString()]
    tokenPath = {
      stableToken: {
        address: stableToken,
        amount: amountIn,
        symbol: getTokenInfo(dstChain, stableToken).symbol,
      },
      destnationtoken: {
        address: destToken,
        amount: amountOut,
        symbol: getTokenInfo(dstChain, destToken).symbol,
      },
    };
  }

  await transferDB.create({
    id: id.toLowerCase(),
    blocktimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    transactionHash: transaction.transaction_hash,
    destnationtoken: tokenPath.destnationtoken,
    stableToken: tokenPath.stableToken,
    recipientAddress: transaction.transaction_to_address, // Contract from where txn came
    receiverAddress: recipient, // Who received the funds
    paidId: "", // can get this from event
    forwarderAddress: transaction.transaction_from_address,
    messageHash: messageHash,
    execFlag: false, // only for fund
    execData: "", //
    usdValue: "",
  });
};
