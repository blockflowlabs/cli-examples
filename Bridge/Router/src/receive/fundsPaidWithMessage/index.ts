import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { EventNameEnum } from "../../utils/helper";
import { Destination } from "../../types/schema";
import { TransactionType } from "../../utils/gql-filters-type";

/**
 * @dev Event::FundsPaidWithMessage(bytes32 messageHash, address forwarder, uint256 nonce, bool execFlag, bytes execData)
 * @param context trigger object with contains {event: {messageHash ,forwarder ,nonce ,execFlag ,execData }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsPaidWithMessageHandler = async (
  context: IEventContext,
  bind: IBind
) => {
  // Implement your event handler logic for FundsPaidWithMessage here
  const { event, transaction, block } = context;
  let { messageHash, forwarder, nonce, execFlag, execData } = event;

  messageHash = messageHash.toString();
  nonce = nonce.toString();

  const transferDB: Instance = bind(Destination);

  const id = `${block.chain_id}_${transaction.transaction_hash}_${nonce}`;

  let dstEntry: any = await transferDB.findOne({
    id: id,
  });
  if (!dstEntry) {
    dstEntry = {};
    dstEntry.id = id;
    dstEntry.blockTimestamp = parseInt(block.block_timestamp.toString(), 10);
    dstEntry.blockNumber = block.block_number;
    dstEntry.chainId = block.chain_id;
    dstEntry.transactionHash = transaction.transaction_hash;
    dstEntry.recipientAddress = transaction.transaction_to_address;
    dstEntry.receiverAddress = transaction.transaction_to_address;
  }
  dstEntry.eventName = EventNameEnum.FundsPaidWithMessage;
  dstEntry.type = TransactionType.AssetForwarder;
  dstEntry.forwarderAddress = forwarder;
  dstEntry.messageHash = messageHash;
  dstEntry.paidId = nonce;
  dstEntry.execData = execData;
  dstEntry.execFlag = execFlag;
  await transferDB.save(dstEntry);
};
