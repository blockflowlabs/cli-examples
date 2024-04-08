import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { Destination, IDestination } from "../../types/schema";

/**
 * @dev Event::FundsPaid(bytes32 messageHash, address forwarder, uint256 nonce)
 * @param context trigger object with contains {event: {messageHash ,forwarder ,nonce }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsPaidHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: Record<string, string>
) => {
  // Implement your event handler logic for FundsPaid here
  const { event, block } = context;
  let { messageHash, forwarder, nonce } = event;

  messageHash = messageHash.toString();
  nonce = nonce.toString();

  const transferDB: Instance = bind(Destination);

  const dstEntry: IDestination = await transferDB.findOne({
    messageHash: messageHash.toLowerCase(),
  });

  if (dstEntry) {
    dstEntry.paidId = nonce;
    await transferDB.save(dstEntry);
  }
};
