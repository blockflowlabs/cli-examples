import { IEventContext, IBind, Instance, ISecrets } from '@blockflow-labs/utils'
import {
  mintTransactionsTable,
  ImintTransactionsTable,
} from '../../types/schema'
import { attestationTable, IattestationTable } from '../../types/schema'

/**
 * @dev Event::MessageReceived(address caller, uint32 sourceDomain, uint64 nonce, bytes32 sender, bytes messageBody)
 * @param context trigger object with contains {event: {caller ,sourceDomain ,nonce ,sender ,messageBody }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MessageReceivedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for MessageReceived here

  const { event, transaction, block, log } = context
  const { caller, sourceDomain, nonce, sender, messageBody } = event

  const mintId = `${nonce.toString()}-${sourceDomain.toString()}-${block.chain_id.toString()}`

  const minttransactionDB: Instance = bind(mintTransactionsTable)

  let minttransaction: ImintTransactionsTable = await minttransactionDB.findOne(
    {
      id: mintId,
    },
  )
  if (minttransaction) {
    return minttransaction
  } else {
    minttransaction ??= await minttransactionDB.create({
      id: mintId,
      transactionHash: transaction.transaction_hash,
      sourceDomain: sourceDomain.toString(),
      destinationDomain: block.chain_id.toString(),
      mintRecipient: caller.toString(),
      timeStamp: block.block_timestamp,
    })
  }

  const attestationDB: Instance = bind(attestationTable)

  let attestation: IattestationTable = await attestationDB.findOne({
    id: mintId,
  })
  if (attestation) {
    return attestation
  } else {
    attestationDB.create({
      id: mintId,
      messageHash: messageBody.toString(),
      timeStamp: block.block_timestamp,
    })
  }
}
