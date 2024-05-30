import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { burnTransactionsTable, IburnTransactionsTable } from "../types/schema";
import { chainIdToDomain, domainToChainId } from "../utils/helper";

/**
 * @dev Event::DepositForBurn(uint64 nonce, address burnToken, uint256 amount, address depositor, bytes32 mintRecipient, uint32 destinationDomain, bytes32 destinationTokenMessenger, bytes32 destinationCaller)
 * @param context trigger object with contains {event: {nonce ,burnToken ,amount ,depositor ,mintRecipient ,destinationDomain ,destinationTokenMessenger ,destinationCaller }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const DepositForBurnHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  const { event, transaction, block, log } = context;
  let {
    nonce,
    burnToken,
    amount,
    depositor,
    mintRecipient,
    destinationDomain,
    destinationTokenMessenger,
    destinationCaller,
  } = event;

  amount = parseInt(amount.toString(), 10);

  const dstChainId: string = domainToChainId[destinationDomain];

  // prettier-ignore
  // ID creation is nonce_src_destination
  const burnId = `${nonce.toString()}_${block.chain_id}_${dstChainId}`.toLowerCase()

  const burntransactionDB: Instance = bind(burnTransactionsTable);

  let burntransaction: IburnTransactionsTable = await burntransactionDB.findOne(
    {
      id: burnId,
    }
  );

  // As the nonce is unique, there can only be single entry for this nonce in database
  burntransaction ??= await burntransactionDB.create({
    id: burnId,
    transactionHash: transaction.transaction_hash,
    sourceDomain: chainIdToDomain[block.chain_id],
    destinationDomain: destinationDomain.toString(),
    amount: amount,
    mintRecipient: mintRecipient.toString(),
    messageSender: depositor.toString(),
    timeStamp: block.block_timestamp,
  });
};
