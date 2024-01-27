import { String, Array } from "@blockflow-labs/utils";

interface Account {
  id: String;
}

interface Registration {
  id: String;
  domain: Domain;
  registrationDate: Number;
  expiryDate: Number;
  cost: Number;
  registrant: Account;
  labelName: String;
  events: [RegistrationEvent];
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
  resolver: Resolver;
  ttl: Number;
  isMigrated: Boolean;
  createdAt: Number;
  owner: String;
  registrant: String;
  wrappedOwner: String;
  expiryDate: Number;
  wrappedDomain: WrappedDomain;
  events: [DomainEvent];
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
