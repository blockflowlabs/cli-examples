import { IEventContext } from "@blockflow-labs/utils";

import { Account, Transfer, Domain } from "../../../types/schema";

export class Transferhelper {
  // prettier-ignore
  ROOT_NODE = "0x0000000000000000000000000000000000000000000000000000000000000000";
  EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
  ACCOUNT: any;
  DOMAIN: any;
  TRANSFER: any;

  constructor(domain: any, account: any, transfer: any) {
    this.DOMAIN = domain;
    this.ACCOUNT = account;
    this.TRANSFER = transfer;
  }

  async createAccount(owner: string) {
    await this.ACCOUNT.create({ id: owner.toLowerCase() });
  }

  async createTransfer(id: string) {
    return await this.TRANSFER.create({ id: id.toLowerCase() });
  }

  async saveTransfer(data: any) {
    await this.TRANSFER.save(data);
  }

  async getDomain(node: string, timestamp: Number = 0) {
    let domain = await this.DOMAIN.findOne({ id: node.toLowerCase() });
    if (!domain || node == this.ROOT_NODE)
      return await this.createDomain(node, timestamp);
    else return domain;
  }

  async createDomain(node: string, timestamp: Number) {
    let domain = await this.DOMAIN.create({ id: node.toLowerCase() });
    if (node == this.ROOT_NODE) {
      domain.owner = this.EMPTY_ADDRESS;
      domain.isMigrated = true;
      domain.createdAt = timestamp;
      domain.subdomainCount = 0;
    }

    return domain;
  }

  async saveDomain(domain: any) {
    // await this.recurseDomainDelete(domain);
    await this.DOMAIN.updateOne({ id: domain.owner.toLowerCase() }, domain);
  }

  async recurseDomainDelete(domain: any) {
    if (
      (domain.resolver == null ||
        domain.resolver!.split("-")[0] == this.EMPTY_ADDRESS) &&
      domain.owner == this.EMPTY_ADDRESS &&
      domain.subdomainCount == 0
    ) {
      const parentDomain = await this.DOMAIN.findOne({
        id: domain.parent.toLowerCase(),
      });
      if (!parentDomain) {
        parentDomain.subdomainCount = parentDomain.subdomainCount - 1;
        await this.DOMAIN.updateOne(
          { id: domain.parent.toLowerCase() },
          parentDomain,
        );
        this.recurseDomainDelete(parentDomain);
      }
    }
  }

  createEventID(context: IEventContext): string {
    return context.block.block_number
      .toString()
      .concat("-")
      .concat(context.log.log_index.toString());
  }
}
