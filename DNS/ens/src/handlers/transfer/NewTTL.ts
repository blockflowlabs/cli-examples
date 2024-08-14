import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Domain } from "../../types/schema";
import { createorloaddomain } from "../../utils/helper";

/**
 * @dev Event::NewTTL(bytes32 node, uint64 ttl)
 * @param context trigger object with contains {event: {node ,ttl }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewTTLHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NewTTL here

  const { event, transaction, block, log } = context;
  const { node, ttl } = event;

  const domainDB: Instance = bind(Domain);
  let domain = await createorloaddomain(
    domainDB,
    node,
    block.block_timestamp,
    bind,
  );
  domain.ttl = ttl;
  await domainDB.save(domain);
};
