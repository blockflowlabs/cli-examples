import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";

import { CrossTransferSrc } from "../types/schema";

/**
 * @dev Event::FundsDeposited(uint256 partnerId, uint256 amount, bytes32 destChainIdBytes, uint256 destAmount, uint256 depositId, address srcToken, address depositor, bytes recipient, bytes destToken)
 * @param context trigger object with contains {event: {partnerId ,amount ,destChainIdBytes ,destAmount ,depositId ,srcToken ,depositor ,recipient ,destToken }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsDepositedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: Record<string, string>
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

  const srcTransferDB: Instance = bind(CrossTransferSrc);

  const transferId = `${recipient}_${depositId}_${block.chain_id}`;

  // create this receipt entry for src chain
  await srcTransferDB.create({
    id: transferId.toLowerCase(),
    chainId: block.chain_id,
    partnerId: partnerId,
    depositId: depositId,
    depositor: depositor,
    srcTxHash: transaction.transaction_hash,
    srcBlockNumber: block.block_number.toString(),
    srcTokenAmount: amount,
    senderAddress: transaction.transaction_from_address,
    srcTxTime: block.block_timestamp,
    srcTxStatus: transaction.transaction_receipt_status,
    srcChain: block.chain_id,
    dstToken: destToken,
    dstTokenAmount: destAmount,
  });
};
