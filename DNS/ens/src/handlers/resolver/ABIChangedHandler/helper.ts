import { Instance, IEventContext } from "@blockflow-labs/utils";

export class AbiChangeHelper {
  ABI_CHANGE: Instance;

  constructor(abiChange: Instance) {
    this.ABI_CHANGE = abiChange;
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

  async createAbiChanged(id: string) {
    return await this.ABI_CHANGE.create({ id: id.toLowerCase() });
  }

  async saveAbiChanged(document: any) {
    await this.ABI_CHANGE.save(document);
  }
}
