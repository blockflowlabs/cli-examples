import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  hexToString,
  chainToContract,
  hashDepositData,
  stringToHex,
} from "../utils/helper";
import { Source } from "../types/schema";

/**
 * @dev Event::FundsDeposited(uint256 partnerId, uint256 amount, bytes32 destChainIdBytes, uint256 destAmount, uint256 depositId, address srcToken, address depositor, bytes recipient, bytes destToken)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,depositor ,recipient ,destToken }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsDepositedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
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

  let messageHash = "0x";

  try {
    messageHash = hashDepositData({
      amount,
      srcChainId: stringToHex(srcChain),
      depositId,
      destToken,
      recipient,
      contract: chainToContract(dstChain),
    });
  } catch (error) {}

  const id = `${srcChain}_${dstChain}_${depositId}`; // messageHash.toLowerCase()

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
      symbol: "XOXO",
    },
    stableToken: {
      address: "",
      amount: "",
      symbol: "",
    },
    depositorAddress: depositor, // Contract from where txn came
    senderAddress: transaction.transaction_to_address, // Who triggered the transaction
    depositId: depositId,
    messageHash: messageHash,
    partnerId: partnerId,
    message: "",
    usdValue: "",
  });
};
