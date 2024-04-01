import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import { Destination, IDestination } from "../../types/schema";

/**
 * @dev Event::FundsPaidWithMessage(bytes32 messageHash, address forwarder, uint256 nonce, bool execFlag, bytes execData)
 * @param context trigger object with contains {event: {messageHash ,forwarder ,nonce ,execFlag ,execData }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const FundsPaidWithMessageHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: Record<string, string>
) => {
  // Implement your event handler logic for FundsPaidWithMessage here
  const { event, transaction, block, log } = context;
  let { messageHash, forwarder, nonce, execFlag, execData } = event;

  messageHash = messageHash.toString();
  nonce = nonce.toString();

  const transferDB: Instance = bind(Destination);

  const dstEntry: IDestination = await transferDB.findOne({
    messageHash: messageHash.toLowerCase(),
  });

  if (dstEntry) {
    dstEntry.paidId = nonce;
    dstEntry.execData = execData;
    dstEntry.execFlag = execFlag;
    await transferDB.save(dstEntry);
  }
};
