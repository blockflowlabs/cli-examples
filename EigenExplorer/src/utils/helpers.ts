import { Instance, ISecrets } from "@blockflow-labs/utils";
import axios, { AxiosResponse } from "axios";
import { AbortController } from "node-abort-controller";
import { utils, providers } from "ethers";
import { Contract, Provider } from "ethers-multicall";
import { InstanceDBOperations } from "@blockflow-labs/sdk/dist/core";

import { strategyAbi } from "../data/abi/strategy";
import { erc20Abi } from "../data/abi/erc20";

export async function fetchWithTimeout(url: string, timeout = 5000): Promise<AxiosResponse | undefined> {
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

export async function getStrategyMetadata(strategyAddress: string, secrets: ISecrets) {
  try {
    const rpcEndpoint = secrets["RPC_ENDPOINT"];
    const provider = new providers.JsonRpcProvider(rpcEndpoint);
    const ethCallProvider = new Provider(provider);

    await ethCallProvider.init();

    const strategyContract = new Contract(strategyAddress, strategyAbi);
    const [underlyingTokenAddress] = await ethCallProvider.all([strategyContract.underlyingToken()]);

    // fetch name, symbol and decimals of the underlying token
    const underlyingTokenContract = new Contract(underlyingTokenAddress, erc20Abi);

    const [name, symbol, decimals] = await ethCallProvider.all([
      underlyingTokenContract.name(),
      underlyingTokenContract.symbol(),
      underlyingTokenContract.decimals(),
    ]);

    return {
      underlyingTokenAddress,
      name,
      symbol,
      decimals: Number(decimals),
    };
  } catch (e) {
    return null;
  }
}

export async function updateStats(db: InstanceDBOperations, key: string, value: number, method?: string) {
  const statsData = await db.load({ statId: "eigen_explorer_stats" });

  if (statsData) {
    const valueToChange = Number(statsData[key]) || 0;
    switch (method) {
      case "add":
        statsData[key] = valueToChange + value;
        break;
      case "subtract":
        statsData[key] = valueToChange - value;
        break;
      default:
        statsData[key] = valueToChange + value;
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

    await db.save({
      statId: "eigen_explorer_stats",
      [key]: valueToAdd,
    });
  }
}

export function getEventPayload(log: any, eventSignature?: string) {
  try {
    // Create an ABI fragment for the event
    const abiFragment = createAbiFragment("event", eventSignature as string);

    // Decode the log using the dynamically created ABI fragment
    const decodedLog = decodeRawLog({ topics: log.topics, data: log.log_data }, abiFragment);

    // Reduce the decoded log arguments into an object
    return decodedLog.args.reduce((acc: any, arg: any, index: any) => {
      const { name } = decodedLog.eventFragment.inputs[index];

      return {
        ...acc,
        [name]: arg,
        [`arg${index + 1}`]: arg,
        [index]: arg,
      };
    }, {});
  } catch (error) {
    return null;
  }
}

function decodeRawLog(rawLog: { topics: string[]; data: string }, abi: any): any {
  try {
    const iFace = new utils.Interface(abi);
    return iFace.parseLog(rawLog);
  } catch (error) {
    throw error;
  }
}

function createAbiFragment(key: string, def: string): string {
  return JSON.stringify([`${key} ${def}`]);
}
