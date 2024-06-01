// supported domain information - https://developers.circle.com/stablecoins/docs/supported-domains
import { Interface } from 'ethers'

export const domainToChainId: { [key: string]: string } = {
    '0': '1', // ethereum
    '1': '43114', // avalanche
    '2': '10', // op
    '3': '42161', // arb
    '6': '8453', // base
    '7': '137', // polygon
  }
  
  export const chainIdToDomain: { [key: string]: string } = Object.entries(
    domainToChainId,
  ).reduce<{ [key: string]: string }>((acc, [key, value]) => {
    acc[value] = key
    return acc
  }, {})

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