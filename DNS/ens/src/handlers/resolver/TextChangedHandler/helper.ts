import { Instance, IEventContext } from "@blockflow-labs/utils";

export class TextChangeHelper {
  RESOLVER: Instance;
  TEXT_CHANGE: Instance;

  constructor(resolver: Instance, textChange: Instance) {
    this.RESOLVER = resolver;
    this.TEXT_CHANGE = textChange;
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

  async createTextChanged(id: string) {
    return await this.TEXT_CHANGE.create({ id: id.toLowerCase() });
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

  async saveTextChanged(document: any) {
    await this.TEXT_CHANGE.save(document);
  }
}
