import { ITransaction } from "@blockflow-labs/utils";

export const COW_PROTOCOL_TOPIC0 =
  "0xa07a543ab8a018198e99ca0184c93fe9050a79400a0a723441f84de1d972cc17";
export const COW_PROTOCOL_ADDRESS =
  "0x9008D19f58AAbD9eD0D60971565AA8510560ab41";
export const SETTLEMENT_LOG_TOPIC =
  "0x40338ce1a7c49204f0099533b1e9a7ee0a3d261f84974ab7af36105b8c4e9db4";

export function pairIdgenerator(str1: string, str2: string): string {
  if (str1 > str2) {
    return str1 + str2;
  } else {
    return str2 + str1;
  }
}

const balancer =  "0x2170c741c41531aec20e7c107c24eecfdd15e69c9bb0a8dd37b1840b9e0b207b";
const uniswapv3 = "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67";
const uniswapv2 = "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822";
const curve = "0x8b3e96f2b889fa771c53c981b40daf005f63f637f1869f707052d15a3dd97140";

export const protocolTopics = {
  balancer,
  uniswapv3,
  uniswapv2,
  curve
};

export function findMatchingProtocols(transaction: any): string {
  const matchingProtocols = new Set<string>();

  if (transaction.logs && Array.isArray(transaction.logs)) {
    transaction.logs.forEach((log: any) => {
      const logTopic = log.topics[0];
      for (const [protocolName, topic] of Object.entries(protocolTopics)) {
        if (logTopic.toLowerCase() === topic.toLowerCase()) {
          matchingProtocols.add(protocolName);
        }
      }
    });
  }

  return Array.from(matchingProtocols).join(', ');
}