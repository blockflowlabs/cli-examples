import { IBind, Instance, IEventContext } from "@blockflow-labs/utils";

import { EventNameEnum } from "../../utils/helper";
import { Destination, Source } from "../../types/schema";
import { getAddress } from "ethers";

/**
 * @dev Function::iRelay(tuple relayData)
 * @param context trigger object with contains {functionParams: {relayData }, transaction, block}
 * @param bind init function for database wrapper methods
 */
const CIRCLE_DOMAIN_MAINNET_ID: any = {
  "0": "1",
  "1": "43114",
  "2": "10",
  "3": "42161",
  "6": "8453",
  "7": "137",
};
const NITRO_FORWARDER = "0x00051d55999c7cd91B17Af7276cbecD647dBC000";
export const MessageReceivedHandler = async (
  context: IEventContext,
  bind: IBind,
) => {
  // Implement your function handler logic for iRelay here
  const { event, transaction, block } = context;
  let { caller, sourceDomain, messageBody, nonce } = event;
  if (caller.toString().toLowerCase() !== NITRO_FORWARDER.toLowerCase()) return;
  const srcChain = CIRCLE_DOMAIN_MAINNET_ID[sourceDomain.toString()];
  const depositId = nonce.toString();

  const dstChain = block.chain_id;
  const transferDB: Instance = bind(Destination);

  const id = `${dstChain}_${transaction.transaction_hash}_${depositId}`;

  let destObj: any = {
    id: id.toLowerCase(),
    //@ts-ignore
    blockTimestamp: parseInt(block.block_timestamp.toString(), 10),
    blockNumber: block.block_number,
    chainId: dstChain,
    eventName: EventNameEnum.MessageReceived,
    transactionHash: transaction.transaction_hash,
    depositId: depositId,
    srcChainId: srcChain,
    recipientAddress: getAddress("0x" + messageBody.slice(98, 138)),
    receiverAddress: getAddress("0x" + messageBody.slice(98, 138)),
  };
  const sourceDB: Instance = bind(Source);
  const srcRecord: any = await sourceDB.findOne({
    id: `${srcChain}_${dstChain}_${depositId}`,
  });
  if (srcRecord) {
    destObj["srcRef"] = { recordRef: srcRecord._id };
  }
  await transferDB.save(destObj);

  if (srcRecord) {
    const savedDest = await transferDB.findOne({
      id,
    });
    srcRecord["destRef"] = { recordRef: savedDest._id };
    await sourceDB.save(srcRecord);
  }
};
