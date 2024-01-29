import { Instance, IEventContext } from "@blockflow-labs/utils";

export class InterfaceChangeHelper {
  INTERFACE: Instance;

  constructor(textChange: Instance) {
    this.INTERFACE = textChange;
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

  async createInterfaceChanged(id: string) {
    return await this.INTERFACE.create({ id: id.toLowerCase() });
  }

  async saveInterfaceChanged(document: any) {
    await this.INTERFACE.save(document);
  }
}
