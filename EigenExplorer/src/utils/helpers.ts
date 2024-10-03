import { IBind, Instance } from "@blockflow-labs/utils";
import axios, { AxiosResponse } from "axios";
import { keccak256 } from "js-sha3";
import { AbortController } from "node-abort-controller";
import { Stats } from "../types/schema";

const encodeFunctionCall = (functionSignature: string, params: any[] = []) => {
  const methodId = keccak256(functionSignature).substring(0, 8);

  const encodedParams = params
    .map((param) => BigInt(param).toString(16).padStart(64, "0"))
    .join("");

  return "0x" + methodId + encodedParams;
};

export const callContractFunction = async (
  strategyAddress: string,
  functionSignature: string,
  params: any[] = [],
  rpcEndpoint: string
) => {
  const encodedData = encodeFunctionCall(functionSignature, params);

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

export async function updateStats(
  db: Instance,
  key: string,
  value: number,
  method?: string
) {
  const statsData = await db.findOne({ id: "eigen_explorer_stats" });

  if (statsData) {
    switch (method) {
      case "add":
        statsData[key] = statsData[key] + value;
        break;
      case "subtract":
        statsData[key] = statsData[key] - value;
        break;
      default:
        statsData[key] = statsData[key] + value;
        break;
    }
    await db.save(statsData);
  } else {
    let valueToAdd = 0;

    switch (method) {
      case "add":
        valueToAdd = value;
        break;
      case "subtract":
        valueToAdd = 0;
        break;
      default:
        valueToAdd = value;
        break;
    }

    await db.create({
      id: "eigen_explorer_stats",
      [key]: valueToAdd,
    });
  }
}
