import { IEventContext, IBind, Instance } from "@blockflow-labs/utils";
import {
  GASLEAKED_TOPIC0,
  decodeGasLeaked,
  getTokenInfo,
  getNetworkName,
} from "../../utils/helper";
import { Destination, IDestination, RefuelInfo } from "../../types/schema";

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

  const isGasLeaked = transaction.logs
    ? transaction.logs.find(
        (log) => log.topics[0].toLowerCase() === GASLEAKED_TOPIC0
      )
    : null;

  if (isGasLeaked) {
    // https://basescan.org/tx/0x6da3e396dca98cb736db6ee824ddffc74e0a4fde8b723a71ab84c5adfa4e3842#eventlog

    const refuelDB: Instance = bind(RefuelInfo);
    const decodeEvent: any = decodeGasLeaked(isGasLeaked);
    await refuelDB.create({
      id: messageHash.toLowerCase(),
      nativeToken: {
        amount: decodeEvent[2].toString(),
        symbol: getTokenInfo(block.chain_id, decodeEvent[0].toString()),
      },
      nativeRecipient: decodeEvent[3].toString(),
    });
  }

  if (dstEntry) {
    dstEntry.paidId = nonce;
    dstEntry.execData = execData;
    dstEntry.execFlag = execFlag;
    await transferDB.save(dstEntry);
  }
};
