import { IEventContext } from "@blockflow-labs/utils";

export function createResolverID(node: string, resolver: string): string {
  return resolver.concat("-").concat(node);
}

export function createEventID(context: IEventContext): string {
  return context.block.block_number
    .toString()
    .concat("-")
    .concat(context.log.log_index.toString());
}
