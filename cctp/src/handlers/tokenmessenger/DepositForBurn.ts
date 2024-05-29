import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { hashNonceAndSourceDomain, getBlockchainName} from "../../utils/helper";
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
const source_domain: string = getBlockchainName(id);

  let Id = hashNonceAndSourceDomain(nonce, source_domain)
 
  const burntransactionDB : Instance = bind(burnTransactionsTable);
  const minttransactionDB : Instance = bind(mintTransactionsTable);

  let burntransaction: IburnTransactionsTable = await burntransactionDB.findOne({
    id:Id,
  });
  if (burntransaction) {
    burntransaction.transactionHash = transaction.transaction_hash;
    burntransaction.sourceDomain = source_domain;
    burntransaction.destinationDomain = destinationDomain.toString();
    burntransaction.amount = amount;
    burntransaction.mintRecipient = mintRecipient.toString();
    burntransaction.messageSender = depositor.toString();
    burntransaction.timeStamp = block.block_timestamp;
  }
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
  if(minttransaction){
  minttransaction.transactionHash = transaction.transaction_hash;
  minttransaction.sourceDomain = source_domain;
  minttransaction.destinationDomain = destinationDomain.toString();
  minttransaction.amount = amount;
  minttransaction.mintRecipient = mintRecipient.toString();
  minttransaction.timeStamp = block.block_timestamp;
  }

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

