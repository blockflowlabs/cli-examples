import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Account, WrappedDomain, Domain, Namewrapperevents } from "../../types/schema";
import { decodeName, createorloadaccount, createorloaddomain, checkPccBurned } from "../../utils/helper";
import { ExpiryExtendedHandler } from "./ExpiryExtended";

/**
 * @dev Event::NameWrapped(bytes32 node, bytes name, address owner, uint32 fuses, uint64 expiry)
 * @param context trigger object with contains {event: {node ,name ,owner ,fuses ,expiry }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameWrappedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NameWrapped here

  const { event, transaction, block, log } = context;
  const { node, name, owner, fuses, expiry } = event;

  let decodedname = decodeName(name);
  let label: string | null = null;
  let decodename: string | null = null;
  if (decodedname != null) {
    label = decodedname[0];
    decodename = decodedname[1];
  }

  const accountDB: Instance = bind(Account);
  const domainDB: Instance = bind(Domain);
  const wrappeddomainDB: Instance = bind(WrappedDomain);
  const namewrappereventsDB: Instance = bind(Namewrapperevents);

  let account = await createorloadaccount(accountDB, owner, bind);
  let domain = await createorloaddomain(domainDB, node, block.block_timestamp, bind);
  if (!domain.labelName && label) {
    domain.labelName = label;
    domain.name = decodename;
  }
  if(
    checkPccBurned(fuses) && (!domain.expiryDate || expiry > domain.expiryDate!)){
     domain.expiryDate = expiry;
    }
    domain.wrappedOwner = account.id;
    await domain.save();

  let wrappeddomain = await wrappeddomainDB.create({
    id: domain.id,
    expiryDate: expiry,
    fuses: fuses,
    name: decodename
  });

  let namewrapperevents = await namewrappereventsDB.create({
    id: domain.id,
    blockNumber: block.block_number,
    transactionID: transaction.transaction_hash,
    fuses: fuses,
    expiryDate: expiry,
    owner: owner
  });
};
