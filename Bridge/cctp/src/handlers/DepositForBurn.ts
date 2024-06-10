import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Stats } from "../utils/tracking";
import { domainToChainId } from "../utils/helper";
import { burnTransactionsTable, IburnTransactionsTable } from "../types/schema";

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
  const burnId =
    `${nonce.toString()}_${block.chain_id}_${dstChainId}`.toLowerCase();

  const burntransactionDB: Instance = bind(burnTransactionsTable);

  let burntransaction: IburnTransactionsTable = await burntransactionDB.findOne(
    {
      id: burnId,
    }
  );

  burntransaction ??= await burntransactionDB.create({
    id: burnId,
    burnToken: burnToken.toString(),
    transactionHash: transaction.transaction_hash,
    sourceDomain: dstChainId,
    destinationDomain: destinationDomain.toString(),
    amount: amount,
    mintRecipient: mintRecipient.toString(),
    messageSender: depositor.toString(),
    timeStamp: block.block_timestamp,
    destinationTokenMessenger: destinationTokenMessenger.toString(),
    destinationCaller: destinationCaller.toString(),
  });

  // prettier-ignore
  try {
    await (new Stats(false, block.chain_id, amount, 0, block.block_timestamp, bind)).update()
  } catch (error) {
    console.log(error);
  }
};
