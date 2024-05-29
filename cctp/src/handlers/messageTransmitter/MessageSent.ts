import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { hashNonceAndSourceDomain, getBlockchainName } from "../../utils/helper";
import { attestationTable, IattestationTable } from "../../types/schema";
/**
 * @dev Event::MessageSent(bytes message)
 * @param context trigger object with contains {event: {message }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MessageSentHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
const { event, transaction, block, log } = context;
const { message , nonce} = event;
  
let id = block.chain_id.toString();

const source_domain: string = getBlockchainName(id);
let Id = hashNonceAndSourceDomain(nonce, source_domain)

const attestationDB: Instance = bind(attestationTable);

let attestation: IattestationTable = await attestationDB.findOne({
    id: Id,
  });
  if(attestation){
  attestation.messageHash = message.toString();
  attestation.timeStamp = block.block_timestamp;
  }
  attestation ??= await attestationDB.create({
    id: Id,
    messageHash: message.toString(),
    timeStamp: block.block_timestamp,
  });
};
