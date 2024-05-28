import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { createHash } from 'crypto';

import { burnTransactionsTable, IburnTransactionsTable } from "../../types/schema";
import { mintTransactionsTable, ImintTransactionsTable } from "../../types/schema";
/**
 * @dev Event::DepositForBurn(uint64 nonce, address burnToken, uint256 amount, address depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)
 * @param context trigger object with contains {event: {nonce ,burnToken ,amount ,depositor ,mintRecipient ,destinationDomain ,destinationTokenMessenger ,destinationCaller }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositForBurnHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {

  const { event, transaction, block, log } = context;
  const {
    nonce,
    burnToken,
    amount,
    depositor,
    mintRecipient,
    destinationDomain,
    destinationTokenMessenger,
    destinationCaller,
  } = event;

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
 
  const burntransactionDB : Instance = bind(burnTransactionsTable);
  const minttransactionDB : Instance = bind(mintTransactionsTable);

  let burntransaction: IburnTransactionsTable = await burntransactionDB.findOne({
    id:Id,
  });

  burntransaction??= await burntransactionDB.create({
    id:Id,
    transactionHash: transaction.transaction_hash,
    sourceDomain: source_domain,
    destinationDomain: destinationDomain.toString(),
    amount: amount,
    mintRecipient: mintRecipient.toString(),
    messageSender: depositor.toString(),
    timeStamp: block.block_timestamp,
  });
  await burntransactionDB.save(burntransaction);

  let minttransaction: ImintTransactionsTable = await minttransactionDB.findOne({
    id:Id,
  });

  minttransaction??= await minttransactionDB.create({
    id:Id,
    transactionHash: transaction.transaction_hash,
    sourceDomain: source_domain,
    destinationDomain: destinationDomain.toString(),
    amount: amount,
    mintRecipient: mintRecipient.toString(),
    timeStamp: block.block_timestamp,
  });
};

