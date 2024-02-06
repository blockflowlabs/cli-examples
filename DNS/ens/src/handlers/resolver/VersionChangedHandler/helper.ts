import { Instance, IEventContext } from "@blockflow-labs/utils";

export class VersionChangeHelper {
  DOMAIN: Instance;
  RESOLVER: Instance;
  VERSION_CHANGE: Instance;

  constructor(domain: Instance, resolver: Instance, versionChange: Instance) {
    this.DOMAIN = domain;
    this.RESOLVER = resolver;
    this.VERSION_CHANGE = versionChange;
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

  async loadDomain(id: string) {
    return await this.DOMAIN.findOne({ id: id.toLowerCase() });
  }

  async saveDomain(domain: any) {
    try {
      await this.DOMAIN.save(domain);
    } catch (error) {
      await this.DOMAIN.updateOne({ id: domain.id.toLowerCase() }, domain);
    }
  }

  async createVersionChanged(id: string) {
    return await this.VERSION_CHANGE.create({ id: id.toLowerCase() });
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
        resolver
      );
    }
  }

  async saveVersionChanged(document: any) {
    await this.VERSION_CHANGE.save(document);
  }
}
