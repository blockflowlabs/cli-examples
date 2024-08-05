import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Stats } from "../utils/tracking";
import { chainIdToDomain, domainToChainId } from "../utils/helper";
import {
  burnTransactionsTable,
  IburnTransactionsTable,
  ImintTransactionsTable,
  mintTransactionsTable,
} from "../types/schema";

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
  const burnId = `${nonce.toString()}_${block.chain_id}_${dstChainId}`.toLowerCase();

  const burntransactionDB: Instance = bind(burnTransactionsTable);

  let burntransaction: IburnTransactionsTable = await burntransactionDB.findOne(
    {
      id: burnId,
    }
  );

  if (!burntransaction) {
    // https://github.com/circlefin/evm-cctp-contracts/blob/master/src/TokenMessenger.sol#L469
    burntransaction = await burntransactionDB.create({
      id: burnId,
      burnToken: burnToken.toString(),
      transactionHash: transaction.transaction_hash,
      sourceDomain: chainIdToDomain[block.chain_id],
      destinationDomain: destinationDomain.toString(),
      amount: amount,
      mintRecipient: mintRecipient.toLowerCase().toString(),
      messageSender: depositor.toString(),
      timeStamp: parseInt(block.block_timestamp),
      destinationTokenMessenger: destinationTokenMessenger.toString(),
      destinationCaller: destinationCaller.toString(),
      isCompleted: false,
    });
  } else {
    // https://github.com/circlefin/evm-cctp-contracts/blob/master/src/TokenMessenger.sol#L290
    burntransaction.mintRecipient = mintRecipient.toString();
    burntransaction.destinationCaller = destinationCaller.toString();

    await burntransactionDB.save(burntransaction);
  }

  const mintDB: Instance = bind(mintTransactionsTable);
  const dstTx: ImintTransactionsTable = await mintDB.findOne({
    id: burnId.toLowerCase(),
  });

  if (dstTx) {
    burntransaction.isCompleted = true;
    await burntransactionDB.save(burntransaction);

    dstTx.messageSender = depositor.toString();
    await mintDB.save(dstTx);
  }

  let feeamount = 0;
  if (dstTx && dstTx.amount) feeamount = amount - dstTx.amount;

  // prettier-ignore
  try {
    await (new Stats(false, block.chain_id, amount, feeamount, block.block_timestamp, bind)).update()
  } catch (error) {
    console.log(error);
  }
};
