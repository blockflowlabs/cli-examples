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
  burnTransactionsTable,
  FeeInfo,
  IFeeInfo,
  IburnTransactionsTable,
  cctpDayDataDB,
  cctpWeekDataDB,
  cctpMonthDataDB,
  cctpYearDataDB,
  cctpAllTimeDB,
} from "../types/schema";
import {
  MESSAGE_RECEIVE_SIG,
  decodeReceiveMessage,
  decodeMintAndWithdraw,
  MINT_AND_WITHDRAW_TOPIC0,
  chainIdToDomain,
  domainToChainId,
} from "../utils/helper";
import {
  updateDailyData,
  updateWeeklyData,
  updateMonthlyData,
  updateYearlyData,
  updateAllTimeData,
} from "../utils/tracking";

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
  const feeinUSDId = block.chain_id;

  const todayEntryDB: Instance = bind(cctpDayDataDB);
  const weekEntryDB: Instance = bind(cctpWeekDataDB);
  const monthEntryDB: Instance = bind(cctpMonthDataDB);
  const yearEntryDB: Instance = bind(cctpYearDataDB);
  const allTimeEntryDB: Instance = bind(cctpAllTimeDB);

  let amountDestination = "";
  let attestationdata = "";

  const isMintAndWithdraw = transaction.logs
    ? transaction.logs.find(
        (log) =>
          log.topics[0].toLowerCase() === MINT_AND_WITHDRAW_TOPIC0.toLowerCase()
      )
    : null;

  if (isMintAndWithdraw) {
    const decodeEvent: any = decodeMintAndWithdraw(
      isMintAndWithdraw.topics,
      isMintAndWithdraw.log_data
    );
    amountDestination = decodeEvent[1].toString();
  }

  const amount = parseInt(amountDestination, 10);
  const mintId = `${nonce}_${srcChainId}_${block.chain_id}`;

  const minttransactionDB: Instance = bind(mintTransactionsTable);
  let minttransaction: ImintTransactionsTable = await minttransactionDB.findOne(
    {
      id: mintId,
    }
  );

  minttransaction ??= await minttransactionDB.create({
    id: mintId,
    amount: amount,
    transactionHash: transaction.transaction_hash,
    sourceDomain: sourceDomain,
    destinationDomain: chainIdToDomain[block.chain_id],
    mintRecipient: caller,
    timeStamp: block.block_timestamp,
  });

  const messagereceivesig = MESSAGE_RECEIVE_SIG.includes(
    transaction.transaction_input.slice(0, 10)
  );

  if (messagereceivesig) {
    const decodeTx: any = decodeReceiveMessage(
      transaction.transaction_input,
      transaction.transaction_value
    );
    attestationdata = decodeTx[1];
  }

  const attestationDB: Instance = bind(attestationTable);

  let attestation: IattestationTable = await attestationDB.findOne({
    id: mintId,
  });

  attestation ??= await attestationDB.create({
    id: mintId,
    attestation: attestationdata.toString(),
    messageHash: messageBody.toString(),
    timeStamp: block.block_timestamp,
  });

  const burnDB: Instance = bind(burnTransactionsTable);
  const srcTx: IburnTransactionsTable = await burnDB.findOne({});
  const amountSource = srcTx.amount;

  const feeamount = amountSource - amount;

  const FeeInfoDB: Instance = bind(FeeInfo);
  let feeinfo: IFeeInfo = await FeeInfoDB.findOne({
    id: feeinUSDId,
  });

  if (feeinfo) {
    feeinfo.feeInUSDC += feeamount;

    await FeeInfoDB.save(feeinfo);
  } else
    feeinfo = await FeeInfoDB.create({
      id: feeinUSDId,
      feeInUSDC: feeamount,
    });

  // prettier-ignore
  try {
    await updateDailyData( block.chain_id, todayEntryDB, amount, feeamount, block.block_timestamp);
    await updateWeeklyData( block.chain_id, weekEntryDB, amount, feeamount, block.block_timestamp);
    await updateMonthlyData( block.chain_id, monthEntryDB, amount, feeamount, block.block_timestamp);
    await updateYearlyData( block.chain_id, yearEntryDB, amount, feeamount, block.block_timestamp);
    await updateAllTimeData(block.chain_id, allTimeEntryDB, amount, feeamount);
  } catch (error) {
    console.log(error);
  }
};
