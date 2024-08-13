import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { Destination } from "../../types/schema";
import { TransactionType } from "../../utils/gql-filters-type";
import { EventNameEnum } from "../../utils/helper";

/**
 * @dev Event::FundsPaid(bytes32 messageHash, address forwarder, uint256 nonce)
 * @param context trigger object with contains {event: {messageHash ,forwarder ,nonce }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsPaidHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for FundsPaid here
  const { event, block, transaction } = context;
  let { messageHash, forwarder, nonce } = event;

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
  dstEntry.eventName = EventNameEnum.FundsPaid;
  dstEntry.type = TransactionType.AssetForwarder;
  dstEntry.forwarderAddress = forwarder;
  dstEntry.messageHash = messageHash;
  dstEntry.paidId = nonce;
  await transferDB.save(dstEntry);
};
