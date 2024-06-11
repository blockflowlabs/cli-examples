import axios from "axios";
import { Interface } from "ethers";

const retryLimit = 12; // Maximum number of retries
const delayBetweenRetries = 400; // 400ms delay between retries
const ABI = [
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

const iface = new Interface(ABI);

export const getRpcProviderUrl = (network: string) => {
  switch (network) {
    case "ethereum":
      return "https://rpc.ankr.com/eth";
    case "polygon":
      return "https://rpc.ankr.com/polygon";
    case "optimism":
      return "https://rpc.ankr.com/optimism";
    case "avalanche":
      return "https://rpc.ankr.com/avalanche";
    default:
      return "https://rpc.ankr.com/eth";
  }
};

export async function nodeRequest(
  data: object,
  network = "Ethereum"
): Promise<any> {
  for (let tries = 0; tries < retryLimit; tries++) {
    const rpc = getRpcProviderUrl(network);

    try {
      let response = await axios.post(rpc, data, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data !== null && response.data !== undefined)
        return response.data;
    } catch (error: any) {
      console.log("nodeRequest::fetch encountered an error -", error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
  }

  throw new Error("nodeRequest failed after retries");
}

const getContractData = async (
  contractAddress: string,
  data: string,
  network: string
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
    const response = await nodeRequest(calldata, network);
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

const getTokenDecimals = async (contractAddress: string, network: string) => {
  // The data for the 'decimals()' function call
  const decimalsSig = "0x313ce567";
  const decimalsHex = await getContractData(
    contractAddress,
    decimalsSig,
    network
  );

  var iface = new Interface(ABI);
  return parseInt(
    iface.decodeFunctionResult("decimals", decimalsHex).toString(),
    10
  );
};

export async function fetchTokenInfo(contractAddress: string, network: string) {
  await getTokenDecimals(contractAddress, network);

  const data = await Promise.all([
    getTokenName(contractAddress, network),
    getTokenSymbol(contractAddress, network),
    getTokenDecimals(contractAddress, network),
  ]);

  return { name: data[0], symbol: data[1], decimals: data[2] };
}
