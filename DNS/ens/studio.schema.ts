import { String, Array, Number } from "@blockflow-labs/utils";

interface Account {
  id: String;
  domains: [String];
  wrappedDomains: [String];
  registrations: [String];
}

interface wrappedTransfer {
  id: String;
  blockNumber: Number;
  transactionID: string;
  owner: string;
}

interface Registration {
  id: String;
  domain: String;
  registrationDate: String;
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
  blockNumber: Number;
};

interface Resolver {
  id: String;
  domain: String;
  address: String;
  addr: String;
  contentHash: String;
  texts: [String];
  coinTypes: [String];
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
  coinType: String;
  addr: String;
}

interface TextChanged {
  id: String;
  resolver: String;
  transactionID: String;
  key: String;
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
  contentType: String;
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

interface Namewrapperevents {
  id: String;
  blockNumber: Number;
  transactionID: String;
  fuses: Number;
  expiryDate: Number;
  owner: String;
}

interface Nameunwrapperevents {
  id: String;
  blockNumber: Number;
  transactionID: String;
  owner: String;
}

interface Fusesburntevent {
  id: String;
  fuses: Number;
  blockNumber: Number;
  transactionID: String;
}

interface Expiryextendedevent {
  id: String;
  expiryDate: Number;
  blockNumber: Number;
  transactionID: String;
}
