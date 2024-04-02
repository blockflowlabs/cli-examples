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
  sourcetoken: Token; // actual token in
  stableToken: Token; // usdt, usdc, eth. @todo Still a doubt, how to fetch it
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
  stableToken: Token; // @todo
  recipientAddress: String; // Contract from where txn came
  receiverAddress: String; // Who received the funds
  paidId: String;
  forwarderAddress: String;
  messageHash: String;
  execFlag: Boolean; // for swap related transaction
  execData: String;
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
  updateId: String; // eventNonce
  isWithdraw: Boolean;
  transactionHash: String;
  refundOutboundId: String; // NA
}

// GasLeaked: Waiting for contact addresses @todo
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
  flowType: String; //Either Asset Forwarder or Asset bridge or Circle flow or Same chain Swap
  gasFeeUsd: String;
  bridgeFeeUsd: String;
  // competitorData: competitorData;
  // Partner info from middle-ware contract
  // sys_fee: String;
  // partner_fee: String;
  // forwarder_fee: String;
  // expiry_timestamp: Number;
}
