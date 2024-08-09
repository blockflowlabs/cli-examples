import { ObjectId } from "@blockflow-labs/utils";

export interface TokensInfo {
  id: string;
  chainId: string;
  address: string;
  symbol: string;
  decimals: string;
  priceUsd: number;
  priceRecordTimestamp: number;
}

type Token = {
  tokenRef: ObjectId;
  amount: String;
};

type RecordRef = {
  recordRef: ObjectId;
};

type CompetitorData = {
  gasFeeUsd: String;
  bridgeFeeUsd: String;
  timeTaken: String;
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
  source: RecordRef;
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
  competitorData: CompetitorData;
  destination: RecordRef;
  withdraw: RecordRef;
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
  source: RecordRef;
}
