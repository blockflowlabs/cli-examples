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
import { TransactionType } from "../../utils/gql-filters-type";

/**
 * @dev Event::TokenTransfer(index bytes32 destChainIdBytes, index address srcTokenAddress, uint256 srcTokenAmount, bytes recipient, uint256 partnerId, uint256 depositId)
 * @param context trigger object with contains {event: {
    destChainIdBytes,
    srcTokenAddress,
    srcTokenAmount,
    recipient,
    partnerId,
    depositId,
  }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TokenTransferHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  // Implement your event handler logic for FundsDeposited here
  const { event, transaction, block } = context;
  let {
    destChainIdBytes,
    srcTokenAddress,
    srcTokenAmount,
    recipient,
    partnerId,
    depositId,
  } = event;

  // sanitising parameters
  {
    partnerId = partnerId.toString();
    srcTokenAddress = srcTokenAddress.toString();
    destChainIdBytes = destChainIdBytes.toString();
    srcTokenAmount = srcTokenAmount.toString();
    depositId = depositId.toString();
    recipient = recipient.toString();
  }

  const srcDB: Instance = bind(Source);
  const srcChain = block.chain_id;
  const dstChain = hexToString(destChainIdBytes);

  const stableTokenInfo = await fetchTokenDetails(
    bind,
    srcChain,
    srcTokenAddress
  );

  const id = `${srcChain}_${dstChain}_${depositId}`;

  const tokenList = {
    sourceToken: {
      amount: formatDecimals(srcTokenAmount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
    stableToken: {
      amount: formatDecimals(srcTokenAmount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
  };

  const isSwapWithReceiptRelay = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === SWAP_WITH_RECIPIENT_TOPIC0
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

  // create this receipt entry for src chain
  let srcObj: any = {
    id: id.toLowerCase(), // message hash
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    destChainId: dstChain,
    transactionHash: transaction.transaction_hash,
    eventName: EventNameEnum.TokenTransfer,
    type: TransactionType.AssetBridge,
    sourceToken: tokenList.sourceToken,
    stableToken: tokenList.stableToken,
    depositorAddress: transaction.transaction_from_address, // Contract from where txn came
    senderAddress: transaction.transaction_from_address, // Who triggered the transaction
    depositId: depositId,
    partnerId: partnerId,
    message: "", // tokenTransferWithMessage
    usdValue: stableTokenInfo.priceUsd
      ? (
          stableTokenInfo.priceUsd * parseFloat(tokenList.stableToken.amount)
        ).toFixed(4)
      : "",
    recipientAddress: recipient,
  };
  const destDB: Instance = bind(Destination);
  const destRecord = await destDB.findOne({
    depositId: depositId,
    srcChainId: srcChain,
  });
  if (destRecord) {
    srcObj["destination"] = { recordRef: destRecord._id };
  }
  await srcDB.save(srcObj);
  if (destRecord) {
    const savedSrcRecord = await srcDB.findOne({ id });
    destRecord["source"] = { recordRef: savedSrcRecord._id };
    await destDB.save(destRecord);
  }
};
