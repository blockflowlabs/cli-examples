import { Instance } from "@blockflow-labs/utils";

export class TextChangeHelper {
  RESOLVER: Instance;

  constructor(resolver: Instance) {
    this.RESOLVER = resolver;
  }

  createResolverID(node: string, resolver: String): string {
    return resolver.concat("-").concat(node);
  }

  async getOrCreateResolver(node: string, address: String) {
    let id = this.createResolverID(node, address);
    let resolver = await this.RESOLVER.findOne({ id: id.toLowerCase() });
    if (!resolver) {
      resolver = await this.RESOLVER.create({ id });
      resolver.domain = node;
      resolver.address = address;
    }

    return resolver;
  }
}
