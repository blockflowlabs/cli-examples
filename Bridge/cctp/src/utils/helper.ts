// supported domain information - https://developers.circle.com/stablecoins/docs/supported-domains

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
