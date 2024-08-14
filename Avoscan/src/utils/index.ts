import { Interface } from "ethers";
import { ILog } from "@blockflow-labs/utils";

import erc20 from "../abis/erc20.json";

// prettier-ignore
const TOPIC_0 = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";

export function getAllTransactionActions(logs: Array<ILog>) {
  const transferlogs = logs
    ? logs.filter(
        (log) => log.topics[0].toLowerCase() === TOPIC_0.toLowerCase()
      )
    : [];

  return transferlogs.map((log) => {
    const decodedLog: any = decodeTransferLog(log.topics, log.log_data);
    return {
      from: decodedLog[0],
      to: decodedLog[1],
      value: decodedLog[2].toString(),
    };
  });
}

export function decodeTransferLog(topics: Array<string>, data: string) {
  const iface = new Interface(erc20);
  return iface.parseLog({ topics, data })?.args;
}
