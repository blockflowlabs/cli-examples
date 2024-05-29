import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { getBlockchainName} from "../../utils/helper";
import { burnTransactionsTable, IburnTransactionsTable } from "../../types/schema";
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

let domainsource = block.chain_id.toString();
const source_domain: string = getBlockchainName(domainsource);
const burnId = `${nonce.toString()}-${domainsource.toString()}-${destinationDomain.toString()}`;
 
const burntransactionDB : Instance = bind(burnTransactionsTable);
  
let burntransaction: IburnTransactionsTable = await burntransactionDB.findOne({
    id: burnId,
});

if (burntransaction) {
    return burntransaction;
} else {
    burntransaction = await burntransactionDB.create({
        id: burnId,
        transactionHash: transaction.transaction_hash,
        sourceDomain: source_domain,
        destinationDomain: destinationDomain.toString(),
        amount: amount,
        mintRecipient: mintRecipient.toString(),
        messageSender: depositor.toString(),
        timeStamp: block.block_timestamp,
    });
    await burntransactionDB.save(burntransaction);
}  
};

