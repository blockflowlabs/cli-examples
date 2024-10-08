// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import { Document } from "@blockflow-labs/utils";

export class Account {
  static entity = "Account";
  static schema = {
    id: { type: "String", index: true },
    domains: ["String"],
    wrappedDomains: ["String"],
    registrations: ["String"],
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class wrappedTransfer {
  static entity = "wrappedTransfer";
  static schema = {
    id: { type: "String", index: true },
    blockNumber: "Number",
    transactionID: "string",
    owner: "string",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Registration {
  static entity = "Registration";
  static schema = {
    id: { type: "String", index: true },
    domain: "String",
    registrationDate: "String",
    expiryDate: "Number",
    cost: "Number",
    registrant: "String",
    labelName: "String",
    events: ["String"],
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class RegistrationEvent {
  static entity = "RegistrationEvent";
  static schema = {
    id: { type: "String", index: true },
    transactionID: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class WrappedDomain {
  static entity = "WrappedDomain";
  static schema = {
    id: { type: "String", index: true },
    expiryDate: "Number",
    fuses: "Number",
    name: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Domain {
  static entity = "Domain";
  static schema = {
    id: { type: "String", index: true },
    name: "String",
    labelName: "String",
    labelhash: "String",
    parent: "String",
    subdomainCount: "Number",
    resolvedAddress: "String",
    owner: "String",
    resolver: "String",
    ttl: "Number",
    isMigrated: "Boolean",
    createdAt: "Number",
    registrant: "String",
    wrappedOwner: "String",
    expiryDate: "Number",
    wrappedDomain: "String",
    events: [
      { domain: "String", transactionID: "String", blockNumber: "Number" },
    ],
    registration: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Resolver {
  static entity = "Resolver";
  static schema = {
    id: { type: "String", index: true },
    domain: "String",
    address: "String",
    addr: "String",
    contentHash: "String",
    texts: ["String"],
    coinTypes: ["String"],
    events: [{ resolver: "String", transactionID: "String" }],
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Transfer {
  static entity = "Transfer";
  static schema = {
    id: { type: "String", index: true },
    domain: "String",
    transactionID: "String",
    owner: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class AddrChanged {
  static entity = "AddrChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    addr: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class MulticoinAddrChanged {
  static entity = "MulticoinAddrChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "string",
    transactionID: "String",
    coinType: "String",
    addr: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class TextChanged {
  static entity = "TextChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    key: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class NameChanged {
  static entity = "NameChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    name: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class AbiChanged {
  static entity = "AbiChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    contentType: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class PubkeyChanged {
  static entity = "PubkeyChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    x: "String",
    y: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class ContenthashChanged {
  static entity = "ContenthashChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    hash: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class InterfaceChanged {
  static entity = "InterfaceChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    interfaceID: "String",
    implementer: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class VersionChanged {
  static entity = "VersionChanged";
  static schema = {
    id: { type: "String", index: true },
    resolver: "String",
    transactionID: "String",
    version: "Number",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Namewrapperevents {
  static entity = "Namewrapperevents";
  static schema = {
    id: { type: "String", index: true },
    blockNumber: "Number",
    transactionID: "String",
    fuses: "Number",
    expiryDate: "Number",
    owner: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Nameunwrapperevents {
  static entity = "Nameunwrapperevents";
  static schema = {
    id: { type: "String", index: true },
    blockNumber: "Number",
    transactionID: "String",
    owner: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Fusesburntevent {
  static entity = "Fusesburntevent";
  static schema = {
    id: { type: "String", index: true },
    fuses: "Number",
    blockNumber: "Number",
    transactionID: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

export class Expiryextendedevent {
  static entity = "Expiryextendedevent";
  static schema = {
    id: { type: "String", index: true },
    expiryDate: "Number",
    blockNumber: "Number",
    transactionID: "String",
    entityId: { type: "String", index: true },
    blocknumber: { type: "Number", index: true },
    chainId: { type: "String", index: true },
    instanceId: { type: "String", index: true },
  };
}

import { String, Array, Number } from "@blockflow-labs/utils";

export interface IAccount extends Document {
  id: String;
  domains: [String];
  wrappedDomains: [String];
  registrations: [String];
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IwrappedTransfer extends Document {
  id: String;
  blockNumber: Number;
  transactionID: string;
  owner: string;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IRegistration extends Document {
  id: String;
  domain: String;
  registrationDate: String;
  expiryDate: Number;
  cost: Number;
  registrant: String;
  labelName: String;
  events: [String];
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IRegistrationEvent extends Document {
  id: String;
  transactionID: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IWrappedDomain extends Document {
  id: String;
  expiryDate: Number;
  fuses: Number;
  name: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IDomain extends Document {
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
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

type DomainEvent = {
  domain: String;
  transactionID: String;
  blockNumber: Number;
};

export interface IResolver extends Document {
  id: String;
  domain: String;
  address: String;
  addr: String;
  contentHash: String;
  texts: [String];
  coinTypes: [String];
  events: [ResolverEvent];
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

type ResolverEvent = {
  resolver: String;
  transactionID: String;
};

export interface ITransfer extends Document {
  id: String;
  domain: String;
  transactionID: String;
  owner: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IAddrChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  addr: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IMulticoinAddrChanged extends Document {
  id: String;
  resolver: string;
  transactionID: String;
  coinType: String;
  addr: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface ITextChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  key: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface INameChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  name: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IAbiChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  contentType: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IPubkeyChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  x: String;
  y: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IContenthashChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  hash: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface InterfaceChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  interfaceID: String;
  implementer: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IVersionChanged extends Document {
  id: String;
  resolver: String;
  transactionID: String;
  version: Number;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface INamewrapperevents extends Document {
  id: String;
  blockNumber: Number;
  transactionID: String;
  fuses: Number;
  expiryDate: Number;
  owner: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface INameunwrapperevents extends Document {
  id: String;
  blockNumber: Number;
  transactionID: String;
  owner: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IFusesburntevent extends Document {
  id: String;
  fuses: Number;
  blockNumber: Number;
  transactionID: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}

export interface IExpiryextendedevent extends Document {
  id: String;
  expiryDate: Number;
  blockNumber: Number;
  transactionID: String;
  blocknumber: String;
  entityId: String;
  instanceId: String;
  chainId: String;
}
