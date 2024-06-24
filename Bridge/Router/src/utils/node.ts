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
      return "https://rpc.ankr.com/eth";
    case "137":
      return "https://rpc.ankr.com/polygon";
    case "10":
      return "https://rpc.ankr.com/optimism";
    case "43114":
      return "https://rpc.ankr.com/avalanche";
    case "8453":
      return "https://base.llamarpc.com";
    case "7225878":
      return "https://rpc.saakuru.network";
    default:
      return "https://rpc.ankr.com/eth";
  }
};

export async function nodeRequest(data: object, chainId = "1"): Promise<any> {
  for (let tries = 0; tries < retryLimit; tries++) {
    const rpc = getRpcProviderUrl(chainId);
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
    //console.log("contractAddress", contractAddress, "chainId", chainId);
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
  const data = await Promise.all([
    getTokenSymbol(contractAddress, chainId),
    getTokenDecimals(contractAddress, chainId),
    //getTokenName(contractAddress, chainId),
  ]);
  return { symbol: data[0], decimals: data[1] };
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
      `https://sentry.lcd.routerprotocol.com/router-protocol/router-chain/pricefeed/price/${symbol}`
    );
    return parseFloat(
      formatDecimals(priceData.data.price.price, priceData.data.price.decimals)
    ).toFixed(6);
  } catch (e: any) {
    console.error("Error in fethcing price from router oracle - ", e?.message);
    return null;
  }
}
