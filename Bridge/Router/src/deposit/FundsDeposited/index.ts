import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import {
  hexToString,
  getTokenInfo,
  EventNameEnum,
  getDestTokenInfo,
  SWAP_WITH_RECIPIENT_TOPIC0,
  decodeSwapWithRecipient,
} from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { fetchTokenDetails } from "../../utils/token";
import { formatDecimals } from "../../utils/formatting";

/**
 * @dev Event::FundsDeposited(uint256 partnerId, uint256 amount, bytes32 destChainIdBytes, uint256 destAmount, uint256 depositId, address srcToken, address depositor, bytes recipient, bytes destToken)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,depositor ,recipient ,destToken }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsDepositedHandler = async (
  context: IEventContext,
  bind: IBind,
) => {
  // Implement your event handler logic for FundsDeposited here
  const { event, transaction, block } = context;
  let {
    partnerId,
    amount,
    destChainIdBytes,
    destAmount,
    depositId,
    srcToken,
    depositor,
    recipient,
    destToken,
  } = event;

  // sanitising parameters
  {
    partnerId = partnerId.toString();
    amount = amount.toString();
    destChainIdBytes = destChainIdBytes.toString();
    destAmount = destAmount.toString();
    depositId = depositId.toString();
    srcToken = srcToken.toString();
    depositor = depositor.toString();
    recipient = recipient.toString();
    destToken = destToken.toString();
  }

  const srcDB: Instance = bind(Source);
  const srcChain = block.chain_id;
  const dstChain = hexToString(destChainIdBytes);
  if (destToken === "0x")
    destToken = getDestTokenInfo(
      dstChain,
      getTokenInfo(srcChain, srcToken)?.symbol,
    )?.address;
  const [stableTokenInfo, stableDestTokenInfo] = await Promise.all([
    fetchTokenDetails(bind, srcChain, srcToken),
    fetchTokenDetails(bind, dstChain, destToken),
  ]);
  const id = `${srcChain}_${dstChain}_${depositId}`;

  const tokenList = {
    sourceToken: {
      amount: formatDecimals(amount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
    stableToken: {
      amount: formatDecimals(amount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
    stableDestToken: {
      amount: stableDestTokenInfo
        ? formatDecimals(destAmount, stableDestTokenInfo.decimals)
        : formatDecimals(destAmount, stableTokenInfo.decimals),
      tokenRef: stableDestTokenInfo ? stableDestTokenInfo._id : null,
    },
  };

  const isSwapWithReceiptRelay = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === SWAP_WITH_RECIPIENT_TOPIC0,
      )
    : null;

  if (isSwapWithReceiptRelay) {
    // https://etherscan.io/tx/0xc396afbd9f874a47b217a57fd74c46299bb79abd460700c01f4407ae166ca5e6
    const decodeEvent: any = decodeSwapWithRecipient(isSwapWithReceiptRelay);
    const [sourceToken, _stableToken] = decodeEvent[1];
    const srcInTokenInfo = await fetchTokenDetails(bind, srcChain, sourceToken);
    // prettier-ignore
    const [amountIn, _amountOut] = [decodeEvent[2].toString(), decodeEvent[5].toString()]
    tokenList["sourceToken"] = {
      tokenRef: srcInTokenInfo._id,
      amount: formatDecimals(amountIn, srcInTokenInfo.decimals),
    };
  }

  const srcObj: any = {
    id: id.toLowerCase(), // message hash
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    destChainId: dstChain,
    transactionHash: transaction.transaction_hash,
    eventName: EventNameEnum.FundsDeposited,
    sourceToken: tokenList.sourceToken,
    stableToken: tokenList.stableToken,
    stableDestToken: tokenList.stableDestToken,
    depositorAddress: depositor, // Contract from where txn came
    senderAddress: transaction.transaction_from_address, // Who triggered the transaction
    depositId: depositId,
    partnerId: partnerId,
    message: "", // fundDepositWithMessage
    usdValue: stableTokenInfo.priceUsd
      ? (
          stableTokenInfo.priceUsd * parseFloat(tokenList.stableToken.amount)
        ).toFixed(4)
      : "",
    fee: {
      tokenRef: tokenList.stableToken.tokenRef,
      amount:
        parseFloat(tokenList.stableToken.amount) -
        parseFloat(tokenList.stableToken.amount),
    },
    recipientAddress: recipient,
  };
  const destDB: Instance = bind(Destination);
  const destRecord = await destDB.findOne({
    depositId: depositId,
    srcChainId: srcChain,
  });
  if (destRecord) {
    srcObj["destRef"] = { recordRef: destRecord._id };
  }
  await srcDB.save(srcObj);
  if (destRecord) {
    const savedSrcRecord = await srcDB.findOne({ id });
    destRecord["srcRef"] = { recordRef: savedSrcRecord._id };
    await destDB.save(destRecord);
  }
};
