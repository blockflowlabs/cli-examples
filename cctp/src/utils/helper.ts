import { Interface } from "ethers";

import tokenmessenger from "../abis/tokenmessenger.json";
import messageTransmitter from "../abis/messageTransmitter.json";

// supported domain information - https://developers.circle.com/stablecoins/docs/supported-domains
export const domainToChainId: { [key: string]: string } = {
  "0": "1", // ethereum
  "1": "43114", // avalanche
  "2": "10", // op
  "3": "42161", // arb
  "6": "8453", // base
  "7": "137", // polygon
};

export const chainIdToDomain: { [key: string]: string } = Object.entries(
  domainToChainId
).reduce<{ [key: string]: string }>((acc, [key, value]) => {
  acc[value] = key;
  return acc;
}, {});

// prettier-ignore
export const MINT_AND_WITHDRAW_TOPIC0 = "0x1b2a7ff080b8cb6ff436ce0372e399692bbfb6d4ae5766fd8d58a7b8cc6142e6";

export const MESSAGE_RECEIVE_SIG = ["0x57ecfd28"];

export function decodeReceiveMessage(input: string, value: string) {
  const iface = new Interface(messageTransmitter);
  return iface.parseTransaction({ data: input, value })?.args;
}

export function decodeMintAndWithdraw(topics: Array<string>, data: string) {
  const iface = new Interface(tokenmessenger);
  return iface.parseLog({ topics, data })?.args;
}
