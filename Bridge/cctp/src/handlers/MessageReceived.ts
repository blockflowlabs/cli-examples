import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  FeeInfo,
  IFeeInfo,
  attestationTable,
  IattestationTable,
  mintTransactionsTable,
  ImintTransactionsTable,
  burnTransactionsTable,
  IburnTransactionsTable,
} from "../types/schema";
import {
  chainIdToDomain,
  domainToChainId,
  MESSAGE_RECEIVE_SIG,
  decodeReceiveMessage,
  decodeMintAndWithdraw,
  MINT_AND_WITHDRAW_TOPIC0,
} from "../utils/helper";
import { Stats } from "../utils/tracking";

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
  // Implement your event handler logic for MessageReceived here 163201_10_1
  const { event, transaction, block, log } = context;
  const { caller, sourceDomain, nonce, sender, messageBody } = event;

  const srcChainId = domainToChainId[sourceDomain];

  let amountDestination = "0";
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
    mintRecipient: caller, // @todo fix this term
    // @TODO add msgSender
    timeStamp: block.block_timestamp, // @todo to number
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
  const srcTx: IburnTransactionsTable = await burnDB.findOne({
    id: mintId.toLowerCase(),
  });

  let feeamount = 0;
  if (srcTx && srcTx.amount) feeamount = srcTx.amount - amount;

  // prettier-ignore
  try {
    await (new Stats(true, block.chain_id, amount, feeamount, block.block_timestamp, bind)).update()
  } catch (error) {
    console.log(error);
  }
};
