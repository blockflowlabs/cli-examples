interface DomainInfo {
  domainName: string
  chainId: number
}

export const DOMAINS: Record<string, DomainInfo> = {
  '0': {
    domainName: 'Ethereum',
    chainId: 1,
  },
  '1': {
    domainName: 'Avalanche',
    chainId: 43114,
  },
  '2': {
    domainName: 'OP Mainnet',
    chainId: 10,
  },
  '3': {
    domainName: 'Arbitrum',
    chainId: 421611,
  },
  '6': {
    domainName: 'Base',
    chainId: 6,
  },
  '7': {
    domainName: 'Polygon PoS',
    chainId: 137,
  },
}

export const getDomainMetadata = (domain: string) => {
  const findedDomain = Object.keys(DOMAINS).filter(
    (tokenAddr) => tokenAddr.toLowerCase() === domain.toLowerCase(),
  )
  return DOMAINS[findedDomain[0]]
}
