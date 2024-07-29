import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Account, Registration, Domain } from "../../types/schema";
import { createorloadaccount, createorloaddomain } from "../../utils/helper";

/**
 * @dev Event::NewOwner(bytes32 node, bytes32 label, address owner)
 * @param context trigger object with contains {event: {node ,label ,owner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewOwnerHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for NewOwner here

  const { event, transaction, block, log } = context;
  const { node, label, owner } = event;
  const accountDB: Instance = bind(Account);
  const domainDB: Instance = bind(Domain);
  const registrationDB: Instance = bind(Registration);

  let account = await createorloadaccount(accountDB, owner, bind);
  let registration = await bind(Registration).create({id: label});
  let domain = await createorloaddomain(
    domainDB,
    node,
    block.block_timestamp,
    bind
  );

  registration.domain = domain.id;
  registration.registrationDate = block.block_timestamp;
  registration.registrant = account.id;
  registration.labelName = label;

  domain.registrant = owner;
  domain.name = label + ".eth";

  await domainDB.save(domain);
  await registrationDB.save(registration);
};
