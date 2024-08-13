export enum TransactionType {
  AssetForwarder = "AssetForwarder",
  AssetBridge = "AssetBridge",
  CircleUSDC = "CircleUSDC",
  Dexspan = "Dexspan",
}

export class MongoDbGenericFilterInput {
  and?: MongoDbGenericFilterInput[];
  or?: MongoDbGenericFilterInput[];
  not?: MongoDbGenericFilterInput;
  eq?: string;
  gt?: number;
  gte?: number;
  in?: string[];
  lt?: number;
  lte?: number;
  ne?: string;
  nin?: string[];
  exists?: boolean;
  regex?: string;
  all?: string[];
  size?: number;
}
export class FundsDepositedInputsFilter {
  partnerId?: MongoDbGenericFilterInput;
  amount?: MongoDbGenericFilterInput;
  destChainIdBytes?: MongoDbGenericFilterInput;
  destAmount?: MongoDbGenericFilterInput;
  depositId?: MongoDbGenericFilterInput;
  srcToken?: MongoDbGenericFilterInput;
  depositor?: MongoDbGenericFilterInput;
  recipient?: MongoDbGenericFilterInput;
  destToken?: MongoDbGenericFilterInput;
  message?: MongoDbGenericFilterInput;
  messageHash?: MongoDbGenericFilterInput;
}

export class FundsDepositedEventsFilter {
  name?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  blockNumber?: MongoDbGenericFilterInput;
  transactionHash?: MongoDbGenericFilterInput;
  fundsPaid?: MongoDbGenericFilterInput;
  timestamp?: MongoDbGenericFilterInput;
  inputs?: FundsDepositedInputsFilter;
}

export class FundsPaidInputsFilter {
  messageHash?: MongoDbGenericFilterInput;
  forwarder?: MongoDbGenericFilterInput;
  nonce?: MongoDbGenericFilterInput;
  execFlag?: MongoDbGenericFilterInput;
  execData?: MongoDbGenericFilterInput;
}

export class FundsPaidEventsFilter {
  name?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  blockNumber?: MongoDbGenericFilterInput;
  transactionHash?: MongoDbGenericFilterInput;
  inputs?: FundsPaidInputsFilter;
  fundsDeposited?: MongoDbGenericFilterInput;
  timestamp?: MongoDbGenericFilterInput;
}

export class DepositInfoUpdateInputsFilter {
  srcToken?: MongoDbGenericFilterInput;
  feeAmount?: MongoDbGenericFilterInput;
  depositId?: MongoDbGenericFilterInput;
  eventNonce?: MongoDbGenericFilterInput;
  initiatewithdrawal?: MongoDbGenericFilterInput;
  depositor?: MongoDbGenericFilterInput;
}

export class DepositInfoUpdateEventsFilter {
  name?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  blockNumber?: MongoDbGenericFilterInput;
  inputs?: DepositInfoUpdateInputsFilter;
  transactionHash?: MongoDbGenericFilterInput;
  fundsDeposited?: MongoDbGenericFilterInput;
}

export class IUSDCDepositedInputsFilter {
  partnerId?: MongoDbGenericFilterInput;
  amount?: MongoDbGenericFilterInput;
  destChainIdBytes?: MongoDbGenericFilterInput;
  usdcNonce?: MongoDbGenericFilterInput;
  srcToken?: MongoDbGenericFilterInput;
  recipient?: MongoDbGenericFilterInput;
  depositor?: MongoDbGenericFilterInput;
}

export class IUSDCDepositedEventsFilter {
  name?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  inputs?: IUSDCDepositedInputsFilter;
  blockNumber?: MongoDbGenericFilterInput;
  transactionHash?: MongoDbGenericFilterInput;
}

export class NitroEventsFilter {
  nonce?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  fundsPaid?: MongoDbGenericFilterInput;
  fundsDeposited?: MongoDbGenericFilterInput;
  updateInfo?: MongoDbGenericFilterInput;
}

export class SyncStateFilter {
  chainId?: MongoDbGenericFilterInput;
  blockNumber?: MongoDbGenericFilterInput;
}

export class SourceTransactionInputsFilter {
  partnerId?: MongoDbGenericFilterInput;
  amount?: MongoDbGenericFilterInput;
  destChainIdBytes?: MongoDbGenericFilterInput;
  depositId?: MongoDbGenericFilterInput;
  srcToken?: MongoDbGenericFilterInput;
  messageHash?: MongoDbGenericFilterInput;
}

export class SourceTransactionEventFilter {
  type?: MongoDbGenericFilterInput;
  name?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  blockNumber?: MongoDbGenericFilterInput;
  timestamp?: MongoDbGenericFilterInput;
  transactionHash?: MongoDbGenericFilterInput;
  inputs?: SourceTransactionInputsFilter;
}

export class DestTransactionInputsFilter {
  messageHash?: MongoDbGenericFilterInput;
  forwarder?: MongoDbGenericFilterInput;
  nonce?: MongoDbGenericFilterInput;
  execFlag?: MongoDbGenericFilterInput;
  execData?: MongoDbGenericFilterInput;
}

export class DestTransactionEventFilter {
  type?: MongoDbGenericFilterInput;
  name?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
  blockNumber?: MongoDbGenericFilterInput;
  timestamp?: MongoDbGenericFilterInput;
  transactionHash?: MongoDbGenericFilterInput;
  inputs?: DestTransactionInputsFilter;
}

export class TransactionFilter {
  transactionHash?: MongoDbGenericFilterInput;
  chainId?: MongoDbGenericFilterInput;
}

export enum NitroTransactionStatus {
  pending = "pending",
  completed = "completed",
  failed = "failed",
}

export enum NitroTransactionType {
  without_instruction = "without_instruction",
  with_instruction = "with_instruction",
  gastopup = "gastopup",
}

export enum NitroContractType {
  asset_forwarder = "asset-forwarder",
  asset_bridge = "asset-bridge",
  circle = "circle",
  same_chain = "same-chain",
}

export enum SortEnum {
  asc = "asc",
  desc = "desc",
}

export class MongoStatusFilterInput {
  eq?: NitroTransactionStatus;
  in?: NitroTransactionStatus[];
}

export class NitroTransactionFilter {
  src_chain_id?: MongoDbGenericFilterInput;
  dest_chain_id?: MongoDbGenericFilterInput;
  status?: MongoStatusFilterInput;
  widget_id?: string;
  transaction_type?: NitroTransactionType;
  sender_address?: string;
  src_tx_hash?: string;
  src_timestamp?: MongoDbGenericFilterInput;
  flow_type?: NitroContractType;
  is_Crosschain?: boolean;
  usdc_value?: MongoDbGenericFilterInput;
}

export class NitroTransactionSort {
  src_timestamp?: SortEnum;
}

export class UserKeysFeild {
  aggregatedCount?: string;
  aggregatedVolume?: string;
  aggregatedTransactions?: string;
  aggregatedTotalVolume?: string;
}
