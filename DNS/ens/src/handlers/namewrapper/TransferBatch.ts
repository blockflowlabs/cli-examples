import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Account, Domain, WrappedDomain } from "../../types/schema";
import { toHexString, createorloadaccount, createorloaddomain } from "../../utils/helper";
/**
 * @dev Event::TransferBatch(address operator, address from, address to, uint256[] ids, uint256[] values)
 * @param context trigger object with contains {event: {operator ,from ,to ,ids ,values }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferBatchHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for TransferBatch here

  const { event, transaction, block, log } = context;
  const { operator, from, to, ids, values } = event;

  const accountDB: Instance = bind(Account);
  const domainDB: Instance = bind(Domain);

  async function makeWrappedTransfer(
    blocknumber: number,
    transactionhash: string,
    eventId: string,
    node: any,
    to: string
  ){
    const _to = createorloadaccount(accountDB,to,bind);
    const namehash = toHexString(node); 
    const domain = createorloaddomain(domainDB,namehash,block.block_timestamp,bind);
    let wrappeDDomain = await bind(WrappedDomain).findOne({id: namehash });

    if(wrappeDDomain == null){
      wrappeDDomain = await bind(WrappedDomain).create({
        id: namehash,
        expiryDate: 0,
        fuses: 0,
        name: "",
        events: [namehash, block.block_number, transaction.transaction_hash]
      });
    }
  }
 
  for (let i = 0; i < ids.length; i++) {
    makeWrappedTransfer(block.block_number, transaction.transaction_hash, `${log.log_address}-${ids[i]}`, ids[i], to);
  }
};
