import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { createHash } from 'crypto';

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

  const sourceDomainMap: { [key: string]: string } = {
    '0': 'Ethereum',
    '1': 'Avalanche',
    '2': 'OP Mainnet',
    '3': 'Arbitrum',
    '6': 'Base',
    '7': 'Polygon PoS'
};

function getBlockchainName(chainIdIndex: string): string {
  return sourceDomainMap[chainIdIndex] ?? "Unknown Blockchain";
}

const source_domain: string = getBlockchainName(id);

function hashNonceAndSourceDomain(nonce: number, source_domain: string): string {
  const nonceBytes = Buffer.alloc(32);
  nonceBytes.writeUInt32LE(nonce, 0)
  const sourceDomainBytes = Buffer.from(source_domain, 'utf-8');
  const combinedBytes = Buffer.concat([nonceBytes, sourceDomainBytes]);
  const hash = createHash('keccak256');
  hash.update(combinedBytes);
  return hash.digest('hex');
}
  let Id = hashNonceAndSourceDomain(nonce, source_domain)

  const attestationDB: Instance = bind(attestationTable);

  let attestation: IattestationTable = await attestationDB.findOne({
    id: Id,
  });

  attestation ??= await attestationDB.create({
    id: Id,
    messageHash: message.toString(),
    timeStamp: block.block_timestamp,
  });

};
