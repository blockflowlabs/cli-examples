export interface CrossTransferSrc {
  id: string; // depositID_src_dst
  partnerId: string;
  depositId: string;
  depositor: string;
  recipient: string;
  srcTxHash: string;
  srcBlockNumber: string;
  srcTokenAmount: string;
  senderAddress: string;
  srcTxTime: string;
  srcTxStatus: string;
  srcChain: string;
  dstChain: string;
  dstToken: string;
  dstTokenAmount: string;
}

export interface CrossTransferDst {
  id: string; //depositID_src_dst
  recipient: string;

  depositId: string;
  destToken: string;
  dstAmount: string;
  srcChain: string;

  dstTxHash: string;
  dstTxTime: string;
  dstTxStatus: boolean;
  dstChain: string;
}

type native = {
  amount: String;
  symbol: String;
};

type Token = {
  address: String;
  amount: String;
  symbol: String;
};

export interface Source {
  id: String; // message hash
  blocktimestamp: Number;
  blockNumber: Number;
  chainId: String;
  transactionHash: String;
  sourcetoken: Token;
  stableToken: Token;
  depositorAddress: String; // Contract from where txn came
  senderAddress: String; // Who triggered the transaction
  depositId: String;
  messageHash: String;
  partnerId: String;
  message: String;
  usdValue: String;
}

export interface Destination {
  id: String; // message hash
  blocktimestamp: Number;
  blockNumber: Number;
  chainId: String;
  transactionHash: String;
  destnationtoken: Token;
  stableToken: Token;
  recipientAddress: String; // Contract from where txn came
  receiverAddress: String; // Who received the funds
  paidId: String;
  forwarderAddress: String;
  messageHash: String;
  execFlag: Boolean;
  execData: String;
  usdValue: String;
}

export interface FeeInfo {
  id: String;
  feeToken: Token;
  usdValue: String;
}

export interface DepositInfoUpdate {
  id: String;
  updateId: String;
  isWithdraw: Boolean;
  transactionHash: String;
  refundOutboundId: String;
}

export interface RefuelInfo {
  id: String;
  nativeToken: native;
}

type competitorData = {
  gasFeeUsd: String;
  bridgeFeeUsd: String;
  time: String;
};

export interface ExtraInfo {
  id: String;
  flowType: String; //Either Asset Forwarder or Asset bridge or Circle flow or Same chain Swap
  gasFeeUsd: String;
  bridgeFeeUsd: String;
  competitorData: competitorData;
  // Partner info from middle-ware contract
  sys_fee: String;
  partner_fee: String;
  forwarder_fee: String;
  expiry_timestamp: Number;
}
