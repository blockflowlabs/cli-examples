import { IEventContext, Instance } from "@blockflow-labs/utils";

export function createResolverID(node: string, resolver: string): string {
  return resolver.concat("-").concat(node);
}

export function createEventID(context: IEventContext): string {
  return context.block.block_number
    .toString()
    .concat("-")
    .concat(context.log.log_index.toString());
}

export async function getResolver(
  node: string,
  address: string,
  resolverDB: Instance
) {
  let id = createResolverID(node, address);
  let resolver = await resolverDB.findOne({ id: id.toLowerCase() });

  resolver ??= await resolverDB.create({
    id: id.toLowerCase(),
    domain: node,
    address: address,
  });

  return resolver;
}
