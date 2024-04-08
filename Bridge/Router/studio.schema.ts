type native = {
  amount: String;
  symbol: String;
};

type Token = {
  address: String;
  amount: String;
  symbol: String;
};

export interface Destination {
  id: String;
  blocktimestamp: Number;
  blockNumber: Number;
  chainId: String;
  transactionHash: String;
  destnationtoken: Token;
  stableToken: Token;
  recipientAddress: String;
  receiverAddress: String;
  paidId: String;
  forwarderAddress: String;
  messageHash: String;
  execFlag: Boolean;
  execData: String;
  usdValue: String;
}

export interface Source {
  id: String;
  blocktimestamp: Number;
  blockNumber: Number;
  chainId: String;
  transactionHash: String;
  sourcetoken: Token;
  stableToken: Token;
  depositorAddress: String;
  senderAddress: String;
  depositId: String;
  messageHash: String;
  partnerId: String;
  message: String;
  usdValue: String;
}

// difference between src and destination
export interface FeeInfo {
  id: String;
  feeToken: Token;
  usdValue: String;
}

//DepositInfoUpdate
export interface DepositInfoUpdate {
  id: String;
  updateId: String;
  isWithdraw: Boolean;
  transactionHash: String;
  refundOutboundId: String;
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
  bridgeFeeUsd: String;
  // competitorData: competitorData;
  // Partner info from middle-ware contract
  // sys_fee: String;
  // partner_fee: String;
  // forwarder_fee: String;
  // expiry_timestamp: Number;
}
