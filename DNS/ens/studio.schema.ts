import { String, Array, Number } from "@blockflow-labs/utils";

interface Account {
  id: String;
  domains: [String]; // domain ids
  wrappedDomains: [String]; // wrapped domain ids
  registrations: [String]; // registration ids
}

interface Registration {
  id: String;
  domain: String;
  registrationDate: Number;
  expiryDate: Number;
  cost: Number;
  registrant: String;
  labelName: String;
  events: [String];
}

interface RegistrationEvent {
  id: String;
  transactionID: String;
}

interface WrappedDomain {
  id: String;
  expiryDate: Number;
  fuses: Number;
  name: String;
}

interface Domain {
  id: String;
  name: String;
  labelName: String;
  labelhash: String;
  parent: String;
  subdomains: [String];
  subdomainCount: Number;
  resolvedAddress: String;
  owner: String;
  resolver: String;
  ttl: Number;
  isMigrated: Boolean;
  createdAt: Number;
  registrant: String;
  wrappedOwner: String;
  expiryDate: Number;
  wrappedDomain: String;
  events: [DomainEvent];
  registration: String;
}

type DomainEvent = {
  domain: String;
  transactionID: String;
};

interface Resolver {
  id: String;
  domain: String;
  address: String;
  addr: String;
  contentHash: String;
  texts: [String];
  coinTypes: [Number];
  events: [ResolverEvent];
}

type ResolverEvent = {
  resolver: String;
  transactionID: String;
};

interface Transfer {
  id: String;
  domain: String;
  transactionID: String;
  owner: String;
}

interface AddrChanged {
  id: String;
  resolver: String;
  transactionID: String;
  addr: String;
}

interface MulticoinAddrChanged {
  id: String;
  resolver: string;
  transactionID: String;
  coinType: Number;
  addr: String;
}

interface TextChanged {
  id: String;
  resolver: String;
  transactionID: String;
  key: String;
  value: String;
}

interface NameChanged {
  id: String;
  resolver: String;
  transactionID: String;
  name: String;
}

interface AbiChanged {
  id: String;
  resolver: String;
  transactionID: String;
  contentType: Number;
}

interface PubkeyChanged {
  id: String;
  resolver: String;
  transactionID: String;
  x: String;
  y: String;
}

interface ContenthashChanged {
  id: String;
  resolver: String;
  transactionID: String;
  hash: String;
}

interface InterfaceChanged {
  id: String;
  resolver: String;
  transactionID: String;
  interfaceID: String;
  implementer: String;
}

interface VersionChanged {
  id: String;
  resolver: String;
  transactionID: String;
  version: Number;
}
