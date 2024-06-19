import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import {
  hexToString,
  getTokenInfo,
  EventNameEnum,
  getDestTokenInfo,
} from "../../utils/helper";
import { Source } from "../../types/schema";
import { fetchTokenDetails } from "../../utils/token";
import { formatDecimals } from "../../utils/formatting";

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
    sourcetoken: {
      amount: formatDecimals(srcTokenAmount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
    stableToken: {
      amount: formatDecimals(srcTokenAmount, stableTokenInfo.decimals),
      tokenRef: stableTokenInfo._id,
    },
  };

  // create this receipt entry for src chain
  await srcDB.save({
    id: id.toLowerCase(), // message hash
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    destChainId: dstChain,
    transactionHash: transaction.transaction_hash,
    eventName: EventNameEnum.TokenTransfer,
    sourcetoken: tokenList.sourcetoken,
    stableToken: tokenList.stableToken,
    depositorAddress: transaction.transaction_from_address, // Contract from where txn came
    senderAddress: transaction.transaction_from_address, // Who triggered the transaction
    depositId: depositId,
    partnerId: partnerId,
    message: "", // tokenTransferWithMessage
    usdValue: (
      stableTokenInfo.priceUsd * parseFloat(tokenList.stableToken.amount)
    ).toFixed(4),
    recipientAddress: recipient,
  });
};
