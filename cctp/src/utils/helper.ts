import { Interface } from 'ethers'

export const sourceDomainMap: { [key: string]: string } = {
  '0': 'Ethereum',
  '1': 'Avalanche',
  '2': 'OP Mainnet',
  '3': 'Arbitrum',
  '6': 'Base',
  '7': 'Polygon PoS',
}

export function getBlockchainName(chainIdIndex: string): string {
  return sourceDomainMap[chainIdIndex] ?? 'Unknown Blockchain'
}
export const MINT_AND_WITHDRAW_TOPIC0 =
  '0x1b2a7ff080b8cb6ff436ce0372e399692bbfb6d4ae5766fd8d58a7b8cc6142e6'

export const MESSAGE_RECEIVE_SIG = ['0x3d12a1ff']
export const DEX_SPAN_ABI = [
  'function receiveMessage(bytes message, bytes attestation) nonpayable',
]
export function decodereceivemessage(input: string, value: string) {
  const iface = new Interface(DEX_SPAN_ABI)
  return iface.parseTransaction({ data: input, value })?.args
}
