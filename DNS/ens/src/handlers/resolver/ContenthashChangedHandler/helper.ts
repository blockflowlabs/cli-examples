import { Instance, IEventContext } from "@blockflow-labs/utils";

export class ContenthashChangeHelper {
  RESOLVER: Instance;
  CONTEXT_HASH_CHANGE: Instance;

  constructor(resolver: Instance, contentHash: Instance) {
    this.RESOLVER = resolver;
    this.CONTEXT_HASH_CHANGE = contentHash;
  }

  createResolverID(node: string, resolver: String): string {
    return resolver.concat("-").concat(node);
  }

  createEventID(context: IEventContext): string {
    return context.block.block_number
      .toString()
      .concat("-")
      .concat(context.log.log_index.toString());
  }

  async createContentHashChanged(id: string) {
    return await this.CONTEXT_HASH_CHANGE.create({ id: id.toLowerCase() });
  }

  // this one is if there are multiple resolvers and you are tracking based on event
  async getOrCreateResolver(node: string, address: String) {
    let id = this.createResolverID(node, address);
    let resolver = await this.RESOLVER.findOne({ id: id.toLowerCase() });
    if (!resolver) {
      resolver = await this.RESOLVER.create({ id: id.toLowerCase() });
      resolver.domain = node;
      resolver.address = address;
    }

    return resolver;
  }

  async saveResolver(resolver: any) {
    try {
      await this.RESOLVER.save(resolver);
    } catch (error) {
      await this.RESOLVER.updateOne(
        { id: resolver.id.toLowerCase() },
        resolver,
      );
    }
  }

  async saveContentHashChanged(document: any) {
    await this.CONTEXT_HASH_CHANGE.save(document);
  }
}
