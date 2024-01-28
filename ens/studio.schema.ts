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
  blockNumber: Number;
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
  resolver: Resolver;
  ttl: Number;
  isMigrated: Boolean;
  createdAt: Number;
  registrant: String;
  wrappedOwner: String;
  expiryDate: Number;
  wrappedDomain: WrappedDomain;
  events: [String];
  registration: Registration;
}

interface Resolver {
  id: String;
  address: String;
  addr: Account;
  contentHash: String;
  texts: [String];
  coinTypes: [Number];
  events: [ResolverEvent];
}

interface ResolverEvent {
  id: String;
  blockNumber: Number;
  transactionID: String;
}

interface DomainEvent {
  id: String;
  blockNumber: Number;
  transactionID: String;
}

interface Transfer {
  id: String;
  domain: String;
  blockNumber: Number;
  transactionID: String;
  owner: String;
}

interface AddrChanged {
  id: String;
  resolver: String;
  blockNumber: Number;
  transactionID: String;
  addr: String;
}

interface MulticoinAddrChanged {
  id: String;
  resolver: string;
  blockNumber: Number;
  transactionID: String;
  coinType: Number;
  addr: String;
}

interface TextChanged {
  id: String;
  resolver: String;
  blockNumber: Number;
  transactionID: String;
  key: String;
  value: String;
}
