import { Instance, IEventContext } from "@blockflow-labs/utils";

export class PubkeyChangeHelper {
  PUBKEY_CHANGE: Instance;

  constructor(textChange: Instance) {
    this.PUBKEY_CHANGE = textChange;
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

  async createPubkeyChanged(id: string) {
    return await this.PUBKEY_CHANGE.create({ id: id.toLowerCase() });
  }

  async savePubkeyChanged(document: any) {
    await this.PUBKEY_CHANGE.save(document);
  }
}
