import { IEventContext } from "@blockflow-labs/utils";

import { Account, Transfer, Domain } from "../../../types/schema";
import { Transferhelper } from "./helper";

/**
 * @dev Event::Transfer(bytes32 node, address owner)
 * @param context trigger object with contains {event: {node ,owner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: Function
) => {
  // Implement your event handler logic for Transfer here

  const { event, transaction, block } = context;
  let { node, owner } = event;

  node = node.toString();
  owner = owner.toString();

  // creating database wrappers for each target class, should be used only once
  const tHelper = new Transferhelper(
    bind(Domain),
    bind(Account),
    bind(Transfer)
  );

  tHelper.createAccount(owner);

  // Update the domain owner
  let domain = await tHelper.getDomain(node);
  domain.owner = owner;

  tHelper.saveDomain(domain);

  let domainEvent = await tHelper.createTransfer(
    tHelper.createEventID(context)
  );

  domainEvent.blockNumber = block.block_number;
  domainEvent.transactionID = transaction.transaction_hash;
  domainEvent.domain = node;
  domainEvent.owner = owner;

  await tHelper.saveTransfer(domainEvent);
};
