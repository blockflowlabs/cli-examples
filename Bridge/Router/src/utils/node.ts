import axios from "axios";
import { Interface } from "ethers";
import { formatDecimals } from "./formatting";

const retryLimit = 12; // Maximum number of retries
const delayBetweenRetries = 400; // 400ms delay between retries
const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const iface = new Interface(ERC20_ABI);

export const getRpcProviderUrl = (chainId: string) => {
  switch (chainId) {
    case "1":
      return [
        "https://rpc.ankr.com/eth",
        "https://eth.llamarpc.com",
        "https://eth-mainnet.public.blastapi.io",
        "https://eth.meowrpc.com",
      ];
    case "137":
      return [
        "https://rpc.ankr.com/polygon",
        "https://polygon.llamarpc.com",
        "https://polygon.rpc.blxrbdn.com",
        "https://polygon.drpc.org",
      ];
    case "10":
      return [
        "https://rpc.ankr.com/optimism",
        "https://optimism.llamarpc.com",
        "https://optimism-mainnet.public.blastapi.io",
        "https://optimism.drpc.org",
      ];
    case "43114":
      return [
        "https://rpc.ankr.com/avalanche",
        "https://ava-mainnet.public.blastapi.io/ext/bc/C/rpc",
        "https://avalanche.public-rpc.com",
        "https://1rpc.io/avax/c",
      ];
    case "8453":
      return [
        "https://base.llamarpc.com",
        "https://base.rpc.subquery.network/public",
        "https://base-mainnet.public.blastapi.io",
        "https://base-mainnet.gateway.tatum.io",
      ];
    case "7225878":
      return ["https://rpc.saakuru.network"];
    case "59144":
      return [
        "https://linea.blockpi.network/v1/rpc/public",
        "https://1rpc.io/linea",
        "https://rpc.linea.build",
        "https://linea.drpc.org",
      ];
    default:
      return ["https://rpc.ankr.com/eth"];
  }
};

export async function nodeRequest(data: object, chainId = "1"): Promise<any> {
  let j = 0;
  const rpcs = getRpcProviderUrl(chainId);
  const rpc = rpcs[j];
  for (let tries = 0; tries < retryLimit; tries++) {
    try {
      let response = await axios.post(rpc, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data !== null && response.data !== undefined)
        return response.data;
    } catch (error: any) {
      //console.log("nodeRequest::fetch encountered an error -", error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
    if (j + 1 === rpcs.length) {
      j = 0;
    } else {
      j++;
    }
  }

  throw new Error("nodeRequest failed after retries");
}

const getContractData = async (
  contractAddress: string,
  data: string,
  chainId: string
) => {
  try {
    const calldata = {
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: contractAddress,
          data: data,
        },
        "latest",
      ],
      id: 1,
    };
    const response = await nodeRequest(calldata, chainId);
    return response.result;
  } catch (error) {
    console.error("Error fetching contract data:", error);
    return null;
  }
};

const getTokenName = async (contractAddress: string, network: string) => {
  // The data for the 'name()' function call (keccak256 hash of 'name()' sliced to 8 characters)
  const nameSig = "0x06fdde03";
  const nameHex = await getContractData(contractAddress, nameSig, network);
  return iface.decodeFunctionResult("name", nameHex).toString();
};

const getTokenSymbol = async (contractAddress: string, network: string) => {
  // The data for the 'symbol()' function call
  const symbolSig = "0x95d89b41";
  const symbolHex = await getContractData(contractAddress, symbolSig, network);
  return iface.decodeFunctionResult("symbol", symbolHex).toString();
};

const getTokenDecimals = async (contractAddress: string, chainId: string) => {
  // The data for the 'decimals()' function call
  const decimalsSig = "0x313ce567";
  const decimalsHex = await getContractData(
    contractAddress,
    decimalsSig,
    chainId
  );

  var iface = new Interface(ERC20_ABI);
  return parseInt(
    iface.decodeFunctionResult("decimals", decimalsHex).toString(),
    10
  );
};

export async function fetchTokenInfo(contractAddress: string, chainId: string) {
  try {
    const data = await Promise.all([
      getTokenSymbol(contractAddress, chainId),
      getTokenDecimals(contractAddress, chainId),
      //getTokenName(contractAddress, chainId),
    ]);
    console.log("contractAddress", contractAddress);
    console.log("data", data);
    return { symbol: data[0], decimals: data[1] };
  } catch (e) {
    return { symbol: "Unknown", decimals: "0" };
  }
}

export async function fetchTokenPriceFromOracle(symbol: string) {
  try {
    const lowSymbol = symbol.toLowerCase();
    if (
      lowSymbol === "usdc" ||
      lowSymbol === "usdt" ||
      lowSymbol === "usdc.e" ||
      lowSymbol === "fdusd" ||
      lowSymbol === "tusd" ||
      lowSymbol === "dai"
    ) {
      return "1";
    }
    const priceData = await axios.get(
      `https://sentry.lcd.routerprotocol.com/router-protocol/router-chain/pricefeed/price/${symbol}`,
    );
    return parseFloat(
      formatDecimals(priceData.data.price.price, priceData.data.price.decimals),
    ).toFixed(6);
  } catch (e: any) {
    console.error("Error in fethcing price from router oracle - ", e?.message);
    return null;
  }
}
