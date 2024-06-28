import { IEventContext } from "@blockflow-labs/utils";

import { Domain, WrappedDomain } from "../../../types/schema";
import { resolveAddress } from "ethers";
/**
 * @dev Event::NewOwner(bytes32 node, bytes32 label, address owner)
 * @param context trigger object with contains {event: {node ,label ,owner }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewOwnerHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NewOwner here

  const { event, transaction, block, log } = context;
  const { node, label, owner } = event;

  const domain = await bind(Domain).findOne({ id: node.toLowerCase() });
  if (!domain) {
    await bind(Domain).create({
      id: node.toLowerCase(),
      name: "",
      labelName: label.toString(),
      labelhash: "",
      parent: node.toString(),
      subdomainCount: 0,
      resolvedAddress: "",
      owner: owner.toString(),
      resolver: "",
      ttl: null,
      isMigrated: false,
      createdAt: block.block_timestamp,
      registrant: "",
      wrappedOwner: "",
      expiryDate: null,
      WrappedDomain: "",
      events: [node, transaction.transaction_hash, block.block_number],
      registration: ""
      //do i need to fill all other entries of domain DB??? while creating 
    });
  } else {
    domain.owner = owner.toString();
    await domain.save();
  }
};
