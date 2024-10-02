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

    return result;
  } catch (error) {
    console.error("Error making the RPC call:", error);
  }
};

export async function fetchWithTimeout(
  url: string,
  timeout = 5000
): Promise<AxiosResponse | undefined> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await axios(url, { signal: controller.signal });
    return response;
  } catch {
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface EntityMetadata {
  name: string;
  description: string;
  discord: string;
  logo: string;
  telegram: string;
  website: string;
  x: string;
}

export function validateMetadata(metadata: string): EntityMetadata | null {
  try {
    const data = JSON.parse(metadata);

    if (
      !(typeof data.name === "string" && typeof data.description === "string")
    ) {
      return null;
    }

    return {
      name: data.name || "",
      website: data.website || "",
      description: data.description || "",
      logo: data.logo || "",
      x: data.x || data.twitter || "",
      discord: data.discord || "",
      telegram: data.telegram || "",
    };
  } catch {}

  return null;
}
