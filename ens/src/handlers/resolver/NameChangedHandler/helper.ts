import { Instance, IEventContext } from "@blockflow-labs/utils";

export class NameChangeHelper {
  NAME_CHANGE: Instance;

  constructor(textChange: Instance) {
    this.NAME_CHANGE = textChange;
  }

  createResolverID(node: string, resolver: String): string {
    return resolver.concat("-").concat(node);
  }

  async createNameChanged(id: string) {
    return await this.NAME_CHANGE.create({ id: id.toLowerCase() });
  }

  async saveTextChanged(document: any) {
    await this.NAME_CHANGE.save(document);
  }

  createEventID(context: IEventContext): string {
    return context.block.block_number
      .toString()
      .concat("-")
      .concat(context.log.log_index.toString());
  }
}
