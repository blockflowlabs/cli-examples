import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  hexToString,
  chainToContract,
  getTokenInfo,
  SWAP_AND_DEPOSIT_SIGS,
  decodeSwapAndDeposit,
  EventNameEnum,
  getDestTokenInfo,
} from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";
import { fetchLifiFeeTimeData } from "../../utils/liFi";

/**
 * @dev Event::FundsDepositedWithMessage(uint256 partnerId, uint256 amount, bytes32 destChainIdBytes, uint256 destAmount, uint256 depositId, address srcToken, bytes recipient, address depositor, bytes destToken, bytes message)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,recipient ,depositor ,destToken ,message }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsDepositedWithMessageHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for FundsDepositedWithMessage here
  const { event, transaction, block } = context;
  let {
    partnerId,
    amount,
    destChainIdBytes,
    destAmount,
    depositId,
    srcToken,
    recipient,
    depositor,
    destToken,
    message,
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
    message = message.toString();
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
  let lifFiFromAmount = amount,
    lifFiFromToken = srcToken;
  let tokenPath = {
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

  const isSwapAndDeposit = SWAP_AND_DEPOSIT_SIGS.includes(
    transaction.transaction_input.slice(0, 10),
  );

  if (isSwapAndDeposit) {
    // https://etherscan.io/tx/0xc396afbd9f874a47b217a57fd74c46299bb79abd460700c01f4407ae166ca5e6
    const decodeTx: any = decodeSwapAndDeposit(
      transaction.transaction_input,
      transaction.transaction_value,
    );

    const swapData = decodeTx[6];
    const [sourceToken, _stableToken] = swapData[0];
    const sourceTokenInfo = await fetchTokenDetails(
      bind,
      srcChain,
      sourceToken,
    );
    // prettier-ignore
    const [amountIn, _amountOut] = [swapData[1].toString(), amount];
    tokenPath["sourceToken"] = {
      amount: formatDecimals(amountIn, sourceTokenInfo.decimals),
      tokenRef: sourceTokenInfo._id,
    };
    lifFiFromAmount = amountIn;
    lifFiFromToken = sourceToken;
  }

  const competitorData = await fetchLifiFeeTimeData({
    fromChainId: srcChain,
    fromAmount: lifFiFromAmount,
    fromTokenAddress: lifFiFromToken,
    toChainId: dstChain,
    toTokenAddress: destToken,
  });
  const id = `${srcChain}_${dstChain}_${depositId}`;

  // create this receipt entry for src chain
  let srcObj: any = {
    id: id.toLowerCase(), // message hash
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    destChainId: dstChain,
    transactionHash: transaction.transaction_hash,
    eventName: EventNameEnum.FundsDepositedWithMessage,
    sourceToken: tokenPath.sourceToken,
    stableToken: tokenPath.stableToken,
    stableDestToken: tokenPath.stableDestToken,
    depositorAddress: depositor,
    senderAddress: transaction.transaction_from_address,
    depositId: depositId,
    partnerId: partnerId,
    message: message,
    usdValue: stableTokenInfo.priceUsd
      ? (
          stableTokenInfo.priceUsd * parseFloat(tokenPath.stableToken.amount)
        ).toFixed(4)
      : "",
    fee: {
      tokenRef: tokenPath.stableToken.tokenRef,
      amount:
        parseFloat(tokenPath.stableToken.amount) -
        parseFloat(tokenPath.stableToken.amount),
    },
    recipientAddress: recipient,
    competitorData: competitorData,
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
