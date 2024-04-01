import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  hexToString,
  chainToContract,
  hashDepositDataWithMessage,
  stringToHex,
  getTokenInfo,
} from "../../utils/helper";
import { Source } from "../../types/schema";

/**
 * @dev Event::FundsDepositedWithMessage(uint256 partnerId, uint256 amount, bytes32 destChainIdBytes, uint256 destAmount, uint256 depositId, address srcToken, bytes recipient, address depositor, bytes destToken, bytes message)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,recipient ,depositor ,destToken ,message }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsDepositedWithMessageHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: Record<string, string>,
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

  const tokenInfo = getTokenInfo(srcChain, srcToken);
  let messageHash = "0x";
  if (destToken === "0x") destToken = tokenInfo.token;

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

  const id = `${srcChain}_${dstChain}_${depositId}_${chainToContract(srcChain)}_${chainToContract(dstChain)}`; // messageHash.toLowerCase()

  // create this receipt entry for src chain
  await srcDB.create({
    id: id.toLowerCase(), // message hash
    blocktimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: srcChain,
    transactionHash: transaction.transaction_hash,
    sourcetoken: {
      address: srcToken,
      amount: amount,
      symbol: tokenInfo.symbol,
    },
    stableToken: {
      address: "",
      amount: "",
      symbol: "",
    },
    depositorAddress: depositor,
    senderAddress: transaction.transaction_from_address,
    depositId: depositId,
    messageHash: messageHash,
    partnerId: partnerId,
    message: message,
    usdValue: "",
  });
};
