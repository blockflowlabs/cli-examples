import { TransactionType } from "./gql-filters-type";
import { EventNameEnum } from "./helper";

export const convertToOldNitroTxn = (txn: any) => {
  if (txn) {
    return {
      src_timestamp: txn?.blockTimestamp,
      dest_timestamp:
        txn?.type === TransactionType.Dexspan
          ? txn?.blockTimestamp
          : txn?.destination?.blockTimestamp,
      src_block_number: txn?.blockNumber,
      dest_block_number:
        txn?.type === TransactionType.Dexspan
          ? txn?.blockNumber
          : txn?.destination?.blockNumber,
      src_chain_id: txn?.chainId,
      dest_chain_id:
        txn?.type === TransactionType.Dexspan
          ? txn?.chainId
          : txn?.destination
            ? txn?.destination?.chainId
            : txn?.destChainId
              ? txn?.destChainId
              : "",
      src_chain_type: "EVM",
      dest_chain_type: "EVM",
      src_tx_hash: txn?.transactionHash,
      dest_tx_hash:
        txn?.type === TransactionType.Dexspan
          ? txn?.transactionHash
          : txn?.destination?.transactionHash,
      status:
        txn?.type === TransactionType.Dexspan
          ? "completed"
          : txn?.destination
            ? "completed"
            : txn?.withdraw
              ? txn?.withdraw.isWithdraw === "true"
                ? "failed"
                : "pending"
              : "pending",
      src_address: txn?.sourceToken?.address
        ? txn?.sourceToken?.address
        : txn?.stableToken?.address,
      dest_address:
        txn?.type === TransactionType.Dexspan
          ? txn?.stableDestToken?.address
          : txn?.destination?.destinationToken?.address,
      src_amount: txn?.sourceToken?.amount
        ? txn?.sourceToken?.amount
        : txn?.stableToken?.amount,
      dest_amount:
        txn?.type === TransactionType.Dexspan
          ? txn?.stableDestToken?.address
          : txn?.destination?.destinationToken?.amount,
      src_symbol: txn?.sourceToken?.symbol
        ? txn?.sourceToken?.symbol
        : txn?.stableToken?.symbol,
      dest_symbol:
        txn?.type === TransactionType.Dexspan
          ? txn?.stableDestToken?.symbol
          : txn?.type === TransactionType.CircleUSDC
            ? "USDC"
            : txn?.destination?.destinationToken?.symbol,
      fee_amount:
        txn?.type === TransactionType.Dexspan ? "0" : txn?.fee?.amount,
      fee_address:
        txn?.type === TransactionType.Dexspan ? null : txn?.fee?.address,
      fee_symbol:
        txn?.type === TransactionType.Dexspan
          ? null
          : txn?.type === TransactionType.CircleUSDC
            ? NATIVE_INFO[txn?.chainId].symbol
            : txn?.stableToken?.symbol,
      src_stable_symbol: txn?.stableToken?.symbol,
      src_stable_address: txn?.stableToken?.address,
      src_stable_amount: txn?.stableToken?.amount,
      dest_stable_symbol:
        txn?.type === TransactionType.CircleUSDC
          ? "USDC"
          : txn?.destination?.stableToken
            ? txn?.destination?.stableToken?.symbol
            : txn?.stableDestToken
              ? txn?.stableDestToken?.symbol
              : txn?.destination?.destinationToken?.symbol,
      dest_stable_address: txn?.destination?.stableToken
        ? txn?.destination?.stableToken?.address
        : txn?.stableDestToken
          ? txn?.stableDestToken?.address
          : txn?.destination?.destinationToken?.address,
      dest_stable_amount: txn?.destination?.stableToken
        ? txn?.destination?.stableToken?.amount
        : txn?.stableDestToken
          ? txn?.stableDestToken?.amount
          : txn?.destination?.destinationToken?.amount,
      usdc_value: txn?.usdValue,
      depositor_address: txn?.depositorAddress,
      sender_address: txn?.senderAddress
        ? txn?.senderAddress
        : txn?.sourceToken ||
            txn?.chainId === ChainId.ROUTER_MAINNET ||
            txn?.destChainId === ChainId.ROUTER_MAINNET
          ? txn?.depositorAddress
          : "",
      receiver_address:
        txn?.type === TransactionType.Dexspan
          ? txn?.recipientAddress
          : txn?.type === TransactionType.CircleUSDC ||
              txn?.chainId === ChainId.ROUTER_MAINNET ||
              txn?.destChainId === ChainId.ROUTER_MAINNET
            ? txn?.recipientAddress
            : txn?.destination?.receiverAddress
              ? txn?.destination?.receiverAddress
              : txn?.destination?.destinationToken
                ? txn?.recipientAddress
                : txn?.destination?.chainId.includes("near")
                  ? txn?.recipientAddress
                  : "",
      recipient_address: txn?.receiverAddress,
      deposit_id: txn.depositId,
      forwarder_address: txn?.destination?.forwarderAddress,
      message_hash: txn.destination.messageHash,
      has_message: txn?.name === EventNameEnum.FundsDepositedWithMessage,
      message: txn.message,
      update_tx_hash: txn?.withdraw?.transactionHash,
      refund_outbound_id: "",
      fund_paid_confirmed: true,
      deposit_info_type: txn?.withdraw
        ? txn?.withdraw?.isWithdraw === "true"
          ? "withdraw"
          : "fee-update"
        : "none",
      flow_type: getOldNitroTxTypes(txn?.type),
      gas_fee_usd: txn?.gasFeeUsd,
      bridge_fee_usd: txn?.bridgeFeeUsd,
      competitor_data: txn?.competitorData
        ? {
            fee: {
              gas_fee: txn?.competitorData?.fee?.gasFeeUsd,
              bridge_fee: txn?.competitorData?.fee?.bridgeFeeUsd,
            },
            time: txn?.competitorData?.timeTaken,
          }
        : null,
      widget_id: txn.partnerId,
      native_token_amount: txn?.destination?.nativeTokenAmount,
      native_token_symbol: NATIVE_INFO[txn?.destination?.chainId]?.symbol,
      sys_fee: "",
      partner_fee: "",
      forwarder_fee: "",
      expiry_timestamp: 0,
      execFlag: txn?.destination?.execFlag === "true",
      execData: txn?.destination?.execData,
      src_partial_info: !txn,
      dest_partial_info: !txn?.destination,
    };
  }
  return null;
};

export const getOldNitroTxTypes = (type: TransactionType) => {
  const TransactionFlowType = Object.freeze({
    ASSET_BRIDGE: "asset-bridge",
    ASSET_FORWARDER: "asset-forwarder",
    CIRCLE: "circle",
    SAME_CHAIN: "same-chain",
    NONE: "none",
  });
  if (type === TransactionType.AssetForwarder) {
    return TransactionFlowType.ASSET_FORWARDER;
  }
  if (type === TransactionType.AssetBridge) {
    return TransactionFlowType.ASSET_BRIDGE;
  }
  if (type === TransactionType.CircleUSDC) {
    return TransactionFlowType.CIRCLE;
  }
  if (type === TransactionType.Dexspan) {
    return TransactionFlowType.SAME_CHAIN;
  }
  return TransactionFlowType.NONE;
};

export enum ChainId {
  MAINNET = "1",
  ROPSTEN = "3",
  RINKEBY = "4",
  GÖRLI = "5",
  KOVAN = "42",
  POLYGON = "137",
  MUMBAI = "80001",
  OKEX = "66",
  ARBITRUM = "42161",
  FANTOM = "250",
  OPTIMISM = "10",
  XDAI = "100",
  BSC = "56",
  AVALANCHE = "43114",
  FUJI = "43113",
  CRONOS = "25",
  AURORA = "1313161554",
  HARMONY = "1666600000",
  KAVA = "2222",
  MOONBEAM = "1284",
  ROUTER_ALPHA = "router_9605-1",
  NEAR_TESTNET = "near-testnet",
  NEAR = "near",
  SHASHTA = "2494104990",
  TRON = "728126428",
  OSMOSIS_TESTNET = "osmo-test-5",
  OSMOSIS = "osmosis-1",
  LINEA = "59144",
  SCROLL = "534352",
  BASE = "8453",
  ZkSync = "324",
  ZkEvm = "1101",
  MANTLE = "5000",
  MANTA = "169",
  RSK = "30",
  KYOTO_TESTNET = "1998",
  HOLESKY_TESTNET = "17000",
  BLAST_TESTNET = "168587773",
  BLAST_MAINNET = "81457",
  TAIKO_TESTNET = "167008",
  METIS_TESTNET = "59901",
  BOBA_TESTNET = "28882",
  MODE_TESTNET = "919",
  ROLLUX_TESTNET = "57000",
  BOBA = "288",
  MODE = "34443",
  METIS = "1088",
  ARTHERA = "10242",
  MORDOR = "63",
  SAAKURU = "7225878",
  SOLANA = "solana",
  TAIKO = "167000",
  FIRECHAIN_TESTNET = "997",
  AMOY = "80002",
  TAIKO_HELKA = "167009",
  ARBITRUM_SEPOLIA = "421614",
  SCROLL_SEPOLIA = "534351",
  ETHEREUM_SEPOLIA = "11155111",
  AZERO_TESTNET = "aleph-testnet",
  AZERO_MAINNET = "aleph-mainnet",
  KYOTO = "1997",
  DOGECHAIN = "2000",
  XLAYER = "196",
  OASISSAPPHIRE = "23294",
  ROUTER_MAINNET = "router_9600-1",
  FIRECHAIN = "995",
  ROLLUX = "570",
  VANAR = "2040",
}

export const NATIVE_INFO: {
  [key: string]: {
    name: string;
    symbol: string;
    decimals: string;
  };
} = {
  [ChainId.AMOY]: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: "18",
  },
  [ChainId.POLYGON]: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: "18",
  },
  [ChainId.FUJI]: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: "18",
  },
  [ChainId.AVALANCHE]: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: "18",
  },
  [ChainId.SHASHTA]: {
    name: "TRX",
    symbol: "TRX",
    decimals: "18",
  },
  [ChainId.TRON]: {
    name: "TRX",
    symbol: "TRX",
    decimals: "18",
  },
  [ChainId.RINKEBY]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.OPTIMISM]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.ARBITRUM]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.NEAR_TESTNET]: {
    name: "NEAR",
    symbol: "NEAR",
    decimals: "24",
  },
  [ChainId.OSMOSIS_TESTNET]: {
    name: "OSMOSIS",
    symbol: "UOSMO",
    decimals: "6",
  },
  [ChainId.OSMOSIS]: {
    name: "OSMOSIS",
    symbol: "UOSMO",
    decimals: "6",
  },
  [ChainId.LINEA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.SCROLL]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.BASE]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.AURORA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.RSK]: {
    name: "RBTC",
    symbol: "RBTC",
    decimals: "18",
  },
  [ChainId.MANTA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.MANTLE]: {
    name: "MNT",
    symbol: "MNT",
    decimals: "18",
  },
  [ChainId.MAINNET]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.ZkSync]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.ZkEvm]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.BSC]: {
    name: "BNB",
    symbol: "BNB",
    decimals: "18",
  },
  [ChainId.BLAST_TESTNET]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.KYOTO_TESTNET]: {
    name: "KYOTO",
    symbol: "KYOTO",
    decimals: "18",
  },
  [ChainId.HOLESKY_TESTNET]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.BLAST_MAINNET]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.METIS_TESTNET]: {
    name: "METIS",
    symbol: "METIS",
    decimals: "18",
  },
  [ChainId.TAIKO_TESTNET]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.BOBA_TESTNET]: {
    name: "WETH",
    symbol: "WETH",
    decimals: "18",
  },
  [ChainId.MODE_TESTNET]: {
    name: "TSYS",
    symbol: "TSYS",
    decimals: "18",
  },
  [ChainId.ROLLUX_TESTNET]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.BOBA]: {
    name: "WETH",
    symbol: "WETH",
    decimals: "18",
  },
  [ChainId.MODE]: {
    name: "WETH",
    symbol: "WETH",
    decimals: "18",
  },
  [ChainId.METIS]: {
    name: "METIS",
    symbol: "METIS",
    decimals: "18",
  },
  [ChainId.ARTHERA]: {
    name: "AA",
    symbol: "AA",
    decimals: "18",
  },
  [ChainId.MORDOR]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.SAAKURU]: {
    name: "OAS",
    symbol: "OAS",
    decimals: "18",
  },
  [ChainId.TAIKO]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.TAIKO_HELKA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.ARBITRUM_SEPOLIA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.SCROLL_SEPOLIA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.ETHEREUM_SEPOLIA]: {
    name: "ETH",
    symbol: "ETH",
    decimals: "18",
  },
  [ChainId.FIRECHAIN_TESTNET]: {
    name: "5ire",
    symbol: "5ire",
    decimals: "18",
  },
  [ChainId.SOLANA]: {
    name: "SOL",
    symbol: "SOL",
    decimals: "9",
  },
  [ChainId.AZERO_MAINNET]: {
    name: "AZERO",
    symbol: "AZERO",
    decimals: "9",
  },
  [ChainId.AZERO_TESTNET]: {
    name: "AZERO",
    symbol: "AZERO",
    decimals: "9",
  },
  [ChainId.KYOTO]: {
    name: "Kyoto",
    decimals: "18",
    symbol: "KYOTO",
  },
  [ChainId.DOGECHAIN]: {
    name: "DogeChain",
    decimals: "18",
    symbol: "DOGE",
  },
  [ChainId.XLAYER]: {
    name: "xLayer",
    decimals: "18",
    symbol: "OKB",
  },
  [ChainId.OASISSAPPHIRE]: {
    name: "Oasis Sapphire",
    decimals: "18",
    symbol: "ROSE",
  },
  [ChainId.FIRECHAIN]: {
    name: "5ire",
    symbol: "5ire",
    decimals: "18",
  },
  [ChainId.ROLLUX]: {
    name: "SYS",
    symbol: "SYS",
    decimals: "8",
  },
  [ChainId.VANAR]: {
    name: "VANRY",
    symbol: "VANRY",
    decimals: "18",
  },
};

export const USDC_ADDRESS = {
  [ChainId.SOLANA]: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
};

export const getNativeAddress = (chainId: string) =>
  chainId === ChainId.ROUTER_MAINNET.toString()
    ? "route"
    : "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
