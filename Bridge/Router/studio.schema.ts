import { ObjectId } from "@blockflow-labs/utils";

type native = {
  amount: String;
  symbol: String;
};

export interface TokensInfo {
  id: string;
  chainId: string;
  address: string;
  symbol: string;
  decimals: string;
  priceUsd: number;
  priceRecordTimestamp: number;
}

interface Oracle {
  id: string; // Token name
  price: string;
  decimals: number;
  timestamp: number;
}

type Token = {
  tokenRef: ObjectId;
  amount: String;
};

type RecordRef = {
  recordRef: ObjectId;
};

export interface Destination {
  id: String;
  eventName: String;
  blockTimestamp: Number;
  blockNumber: Number;
  chainId: String;
  transactionHash: String;
  destinationToken: Token;
  stableToken: Token;
  recipientAddress: String;
  receiverAddress: String;
  paidId: String;
  forwarderAddress: String;
  messageHash: String;
  execFlag: Boolean;
  execData: String;
  nativeTokenAmount: String;
  depositId: String;
  srcChainId: String;
  srcRef: RecordRef;
}

export interface Source {
  id: String;
  eventName: String;
  blockTimestamp: Number;
  blockNumber: Number;
  chainId: String;
  destChainId: String;
  transactionHash: String;
  sourceToken: Token;
  stableToken: Token;
  depositorAddress: String;
  senderAddress: String;
  depositId: String;
  partnerId: String;
  message: String;
  usdValue: Number;
  fee: Token;
  stableDestToken: Token;
  recipientAddress: String;
  destRef: RecordRef;
  withdrawRef: RecordRef;
}

//DepositInfoUpdate
export interface DepositInfoUpdate {
  id: String;
  eventName: String;
  updateId: String;
  isWithdraw: Boolean;
  transactionHash: String;
  refundOutboundId: String;
  srcChainId: String;
  depositId: String;
  feeAmount: String;
  srcRef: RecordRef;
}

// GasLeaked, emitted with fundPaidWithMessage
export interface RefuelInfo {
  id: String;
  nativeToken: native;
  nativeRecipient: String;
}

type competitorData = {
  gasFeeUsd: String;
  bridgeFeeUsd: String;
  time: String;
};

export interface ExtraInfo {
  id: String;
  flowType: String;
  gasFeeUsd: String;
  bridgeFee: String;
  bridgeFeeUsd: String;
  nativeRecipientAddress: String;
  // competitorData: competitorData;
  // Partner info from middle-ware contract
  // sys_fee: String;
  // partner_fee: String;
  // forwarder_fee: String;
  // expiry_timestamp: Number;
}
