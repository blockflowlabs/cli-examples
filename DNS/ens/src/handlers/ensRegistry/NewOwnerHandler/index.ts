import { IEventContext , Instance} from "@blockflow-labs/utils";

import { Domain, WrappedDomain } from "../../../types/schema";
import { resolveAddress } from "ethers";
import { createorloaddomain } from "../../../utils/helper";
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

  const domainDB : Instance = bind(Domain);

  let domain = await createorloaddomain(domainDB, node, block.block_timestamp, bind);
  domain.owner = owner;
  domain.label = label;
  domain.name = label + ".eth";
  await domainDB.save(domain);
};
