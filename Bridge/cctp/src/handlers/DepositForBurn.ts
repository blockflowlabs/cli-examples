import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  burnTransactionsTable,
  IburnTransactionsTable,
  cctpDayDataDB,
  IcctpDayDataDB,
  cctpWeekDataDB,
  IcctpWeekDataDB,
  cctpMonthDataDB,
  IcctpMonthDataDB,
  cctpYearDataDB,
  IcctpYearDataDB,
  cctpAllTimeDB,
  IcctpAllTimeDB,
} from "../types/schema";
import { chainIdToDomain, domainToChainId } from "../utils/helper";
import {
  getMonthlyEntry,
  getTodayEntry,
  getYearlyEntry,
  getWeeklyEntry,
  getAllTimeEntry,
} from "../utils/tracking";

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
  const todayEntryDB: Instance = bind(cctpDayDataDB);
  const weekEntryDB: Instance = bind(cctpWeekDataDB);
  const monthEntryDB: Instance = bind(cctpMonthDataDB);
  const yearEntryDB: Instance = bind(cctpYearDataDB);
  const allTimeEntryDB: Instance = bind(cctpAllTimeDB);

  try{
  await getTodayEntry(block.chain_id, todayEntryDB, amount, 0);
  await getWeeklyEntry(block.chain_id, weekEntryDB, amount, 0);
  await getMonthlyEntry(block.chain_id, monthEntryDB, amount, 0);
  await getYearlyEntry(block.chain_id, yearEntryDB, amount, 0);
  await getAllTimeEntry(block.chain_id, allTimeEntryDB, amount, 0);
  }catch(error){
    console.log(error);
  }

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
};
