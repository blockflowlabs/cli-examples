import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Domain, Account, Nameunwrapperevents } from "../../types/schema";
import { createorloadaccount, createorloaddomain } from "../../utils/helper";

/**
 * @dev Event::NameUnwrapped(bytes32 node, address owner)
 * @param context trigger object with contains {event: {node ,owner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameUnwrappedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NameUnwrapped here

  const { event, transaction, block, log } = context;
  const { node, owner } = event;

  const ETH_NODE =
    "0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae";

  const accountDB: Instance = bind(Account);
  const domainDB: Instance = bind(Domain);
  const nameunwrappereventsDB: Instance = bind(Nameunwrapperevents);

  let account = await createorloadaccount(accountDB, owner, bind);
  let domain = await createorloaddomain(
    domainDB,
    node,
    block.block_timestamp,
    bind,
  );
  domain.wrappedOwner = "";

  if (domain.expiryDate && domain.parent != ETH_NODE) {
    domain.expiryDate = null;
  }
  domainDB.save(domain);

  let nameunwrapperevent = await nameunwrappereventsDB.create({
    id: node,
    blockNumber: block.block_number,
    transactionID: transaction.transaction_hash,
    owner: owner,
  });
};
