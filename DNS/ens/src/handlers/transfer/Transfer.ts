import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Domain, Account, Registration } from "../../types/schema";

import { createorloadaccount, createorloaddomain } from "../../utils/helper";
/**
 * @dev Event::Transfer(bytes32 node, address owner)
 * @param context trigger object with contains {event: {node ,owner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block, log } = context;
  const { node, owner } = event;

  const domainDB: Instance = bind(Domain);
  const accountDB: Instance = bind(Account);

  const account = await createorloadaccount(accountDB, owner, bind);
  const domain = await createorloaddomain(
    domainDB,
    node,
    block.block_timestamp,
    bind,
  );
  domain.registrant = account.id;
  domain.events = [node, transaction.transaction_hash];
  await domainDB.save(domain);
};
