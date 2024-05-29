import { createHash } from 'crypto';

export const sourceDomainMap: { [key: string]: string } = {
    '0': 'Ethereum',
    '1': 'Avalanche',
    '2': 'OP Mainnet',
    '3': 'Arbitrum',
    '6': 'Base',
    '7': 'Polygon PoS'
};

export function hashNonceAndSourceDomain(nonce: number, source_domain: string): string {
    const nonceBytes = Buffer.alloc(32);
    nonceBytes.writeUInt32LE(nonce, 0)
    const sourceDomainBytes = Buffer.from(source_domain, 'utf-8');
    const combinedBytes = Buffer.concat([nonceBytes, sourceDomainBytes]);
    const hash = createHash('keccak256');
    hash.update(combinedBytes);
    return hash.digest('hex');
  }

export function getBlockchainName(chainIdIndex: string): string {
    return sourceDomainMap[chainIdIndex] ?? "Unknown Blockchain";
  }