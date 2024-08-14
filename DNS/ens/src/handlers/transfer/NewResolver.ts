import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { Domain } from "../../types/schema";
import { createorloaddomain } from "../../utils/helper";

/**
 * @dev Event::NewResolver(bytes32 node, address resolver)
 * @param context trigger object with contains {event: {node ,resolver }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewResolverHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for NewResolver here

  const { event, transaction, block, log } = context;
  const { node, resolver } = event;

  const domainDB: Instance = bind(Domain);
  let domain = await createorloaddomain(
    domainDB,
    node,
    block.block_timestamp,
    bind
  );
  domain.resolver = resolver;
  await domainDB.save(domain);
};
