
export const sourceDomainMap: { [key: string]: string } = {
    '0': 'Ethereum',
    '1': 'Avalanche',
    '2': 'OP Mainnet',
    '3': 'Arbitrum',
    '6': 'Base',
    '7': 'Polygon PoS'
};

export function getBlockchainName(chainIdIndex: string): string {
    return sourceDomainMap[chainIdIndex] ?? "Unknown Blockchain";
  }