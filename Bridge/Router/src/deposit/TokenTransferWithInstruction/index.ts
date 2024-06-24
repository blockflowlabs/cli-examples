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
  SWAP_WITH_RECIPIENT_TOPIC0,
  decodeSwapWithRecipient,
} from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { formatDecimals } from "../../utils/formatting";
import { fetchTokenDetails } from "../../utils/token";

/**
 * @dev Event::TokenTransferWithInstruction (index_topic_1 bytes32 destChainIdBytes, index_topic_2 address srcTokenAddress, uint256 srcTokenAmount, bytes recipient, uint256 partnerId, uint64 destGasLimit, bytes instruction, uint256 depositId)
 * @param context trigger object with contains {event: {destChainIdBytes,
    srcTokenAddress,
    srcTokenAmount,
    instruction,
    recipient,
    partnerId,
    depositId, }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TokenTransferWithInstructionHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for TokenTransferWithInstruction here
  const { event, transaction, block } = context;
  let {
    destChainIdBytes,
    srcTokenAddress,
    srcTokenAmount,
    instruction,
    recipient,
    partnerId,
    depositId,
  } = event;

  // sanitising parameters
  {
    partnerId = partnerId.toString();
    instruction = instruction.toString();
    destChainIdBytes = destChainIdBytes.toString();
    srcTokenAddress = srcTokenAddress.toString();
    depositId = depositId.toString();
    srcTokenAmount = srcTokenAmount.toString();
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
  let tokenPath = {
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
    tokenPath["sourceToken"] = {
      tokenRef: srcInTokenInfo._id,
      amount: formatDecimals(amountIn, srcInTokenInfo.decimals),
    };
  }

  const id = `${srcChain}_${dstChain}_${depositId}}`;

  // create this receipt entry for src chain
  let srcObj: any = {
    id: id.toLowerCase(), // message hash
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    destChainId: dstChain,
    transactionHash: transaction.transaction_hash,
    eventName: EventNameEnum.TokenTransferWithInstruction,
    sourceToken: tokenPath.sourceToken,
    stableToken: tokenPath.stableToken,
    depositorAddress: transaction.transaction_from_address,
    senderAddress: transaction.transaction_from_address,
    depositId: depositId,
    partnerId: partnerId,
    message: instruction,
    usdValue: (
      stableTokenInfo.priceUsd * parseFloat(tokenPath.stableToken.amount)
    ).toFixed(4),
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
