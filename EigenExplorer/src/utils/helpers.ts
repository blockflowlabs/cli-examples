import axios from "axios";
import { keccak256 } from "js-sha3";

const encodeFunctionCall = (shares: string) => {
  const functionSignature = "sharesToUnderlyingView(uint256)";

  const methodId = keccak256(functionSignature).substring(0, 8);

  const encodedShares = BigInt(shares).toString(16).padStart(64, "0");

  return "0x" + methodId + encodedShares;
};

export const getSharesToUnderlying = async (
  strategyAddress: string,
  shares: string,
  rpcEndpoint: string
) => {
  const encodedData = encodeFunctionCall(shares);

  const requestData = {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [
      {
        to: strategyAddress,
        data: encodedData,
      },
      "latest",
    ],
    id: 1,
  };

  try {
    const response = await axios.post(rpcEndpoint, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = response.data.result;

    return BigInt(result);
  } catch (error) {
    console.error("Error making the RPC call:", error);
    throw error;
  }
};
