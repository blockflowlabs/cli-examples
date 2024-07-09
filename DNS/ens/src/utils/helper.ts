import { IEventContext, Instance } from "@blockflow-labs/utils";
import { Domain, Account } from "../types/schema";

export function createResolverID(node: string, resolver: string): string {
  return resolver.concat("-").concat(node);
}

export function createEventID(context: IEventContext): string {
  return context.block.block_number
    .toString()
    .concat("-")
    .concat(context.log.log_index.toString());
}

export async function getResolver(
  node: string,
  address: string,
  resolverDB: Instance
) {
  let id = createResolverID(node, address);
  let resolver = await resolverDB.findOne({ id: id.toLowerCase() });

  resolver ??= await resolverDB.create({
    id: id.toLowerCase(),
    domain: node,
    address: address,
  });

  return resolver;
}

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
    await this.DOMAIN.updateOne(
      { id: domain.owner.toLowerCase() },
      domain
    ).exec();
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
          parentDomain
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

export function decodeName(buf: Uint8Array): Array<string> | null {
  let offset = 0;
  let list = new Uint8Array(0);
  const dot = new Uint8Array([0x2e]);
  let len = buf[offset++];
  let hex = Array.from(buf)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  let firstLabel = "";

  if (len === 0) {
    return [firstLabel, "."];
  }

  // function checkValidLabel(name: string | null): boolean {
  //   if (name == null) {
  //     return false;
  //   }
  //   for (let i = 0; i < name.length; i++) {
  //     let charCode = name.charCodeAt(i);
  //     if (charCode === 0) {
  //       console.warn(`Invalid label '${name}' contained null byte. Skipping.`);
  //       return false;
  //     } else if (charCode === 46) {
  //       console.warn(
  //         `Invalid label '${name}' contained separator char '.'. Skipping.`
  //       );
  //       return false;
  //     } else if (charCode === 91) {
  //       console.warn(`Invalid label '${name}' contained char '['. Skipping.`);
  //       return false;
  //     } else if (charCode === 93) {
  //       console.warn(`Invalid label '${name}' contained char ']'. Skipping.`);
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
    let c = new Uint8Array(a.length + b.length);
    c.set(a);
    c.set(b, a.length);
    return c;
  }

  while (len) {
    let label = hex.slice((offset + 1) * 2, (offset + 1 + len) * 2);
    let labelBytes = Uint8Array.from(Buffer.from(label, "hex"));

    // if (!checkValidLabel(String.fromCharCode(...labelBytes))) {
    //   return null;
    // }

    if (offset > 1) {
      list = concat(list, dot);
    } else {
      firstLabel = String.fromCharCode(...labelBytes);
    }
    list = concat(list, labelBytes);
    offset += len;
    len = buf[offset++];
  }
  return [firstLabel, String.fromCharCode(...list)];
}

export function toHexString(value: bigint): string {
  return "0x" + value.toString(16).padStart(64, "0");
}

export async function createorloaddomain(
  domainDB: Instance,
  node: string,
  timestamp: String,
  bind: Function
) {
  let domain = await domainDB.findOne({ id: node.toLowerCase() });
  if (!domain) {
    domain = await domainDB.create({
      id: node.toLowerCase(),
      name: "",
      labelName: "",
      labelhash: "",
      parent: "",
      subdomains: [],
      subdomainsCount: 0,
      resolvedAddress: "",
      owner: "",
      resolver: "",
      ttl: 0,
      isMigrated: false,
      createdAt: 0,
      registrant: "",
      wrappedOwner: "",
      expiryDate: 0,
      wrappedDomain: "",
      events: [],
      registration: "",
    });
    domain.createdAt = timestamp;
  }
  return domain;
}

export async function createorloadaccount(
  accountDB: Instance,
  owner: string,
  bind: Function
) {
  let account = await accountDB.findOne({ id: owner.toLowerCase() });
  if (!account) {
    account = await accountDB.create({
      id: owner.toLowerCase(),
      domains: [],
      wrappedDomains: [],
      registrations: [],
    });
  }
  return account;
}

export const PARENT_CANNOT_CONTROL = 65536;
export function checkPccBurned(fuses: any): boolean {
  return (fuses & PARENT_CANNOT_CONTROL) == PARENT_CANNOT_CONTROL;
}
