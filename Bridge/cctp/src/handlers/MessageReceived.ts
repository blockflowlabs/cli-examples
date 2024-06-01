import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  attestationTable,
  IattestationTable,
  mintTransactionsTable,
  ImintTransactionsTable,
} from "../types/schema";
import { chainIdToDomain, domainToChainId } from "../utils/helper";

/**
 * @dev Event::MessageReceived(address caller, uint32 sourceDomain, uint64 nonce, bytes32 sender, bytes messageBody)
 * @param context trigger object with contains {event: {caller ,sourceDomain ,nonce ,sender ,messageBody }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MessageReceivedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for MessageReceived here
  const { event, transaction, block, log } = context;
  const { caller, sourceDomain, nonce, sender, messageBody } = event;

  const srcChainId = domainToChainId[sourceDomain];

  const mintId = `${nonce.toString()}_${srcChainId}_${block.chain_id.toString()}`;

  const minttransactionDB: Instance = bind(mintTransactionsTable);

  let minttransaction: ImintTransactionsTable = await minttransactionDB.findOne(
    {
      id: mintId,
    }
  );

  minttransaction ??= await minttransactionDB.create({
    id: mintId,
    transactionHash: transaction.transaction_hash,
    sourceDomain: sourceDomain,
    destinationDomain: chainIdToDomain[block.chain_id],
    mintRecipient: caller,
    timeStamp: block.block_timestamp,
  });

  const attestationDB: Instance = bind(attestationTable);

  let attestation: IattestationTable = await attestationDB.findOne({
    id: mintId,
  });

  attestation ??= await attestationDB.create({
    id: mintId,
    messageHash: messageBody.toString(),
    timeStamp: block.block_timestamp,
  });
};
