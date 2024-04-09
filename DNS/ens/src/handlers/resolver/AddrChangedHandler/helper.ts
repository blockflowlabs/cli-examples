import { Instance, IEventContext } from "@blockflow-labs/utils";

export class AddrChangeHelper {
  DOMAIN: Instance;
  ACCOUNT: Instance;
  RESOLVER: Instance;
  ADDR_CHANGE: Instance;

  constructor(
    account: Instance,
    domain: Instance,
    resolver: Instance,
    addrChange: Instance,
  ) {
    this.DOMAIN = domain;
    this.ACCOUNT = account;
    this.RESOLVER = resolver;
    this.ADDR_CHANGE = addrChange;
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

  async createAccountChanged(id: string) {
    return await this.ACCOUNT.create({ id: id.toLowerCase() });
  }

  async saveAccountChanged(document: any) {
    await this.ACCOUNT.save(document);
  }

  async createAddrChanged(id: string) {
    return await this.ADDR_CHANGE.create({ id: id.toLowerCase() });
  }

  async saveAddrChanged(document: any) {
    await this.ADDR_CHANGE.save(document);
  }

  // this one is if there are multiple resolvers and you are tracking based on event
  async createResolver(node: string, address: String) {
    let id = this.createResolverID(node, address);

    return await this.RESOLVER.create({ id: id.toLowerCase() });
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
}
