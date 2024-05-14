interface TokenInfo {
  name: string
  symbol: string
  decimals: number
  quoteCurrency: string
}

export const TOKENS: Record<string, TokenInfo> = {
  '0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8': {
    name: '1inch',
    symbol: '1INCH',
    decimals: 18,
    quoteCurrency: 'ETH',
  },
  '0xc929ad75B72593967DE83E7F7Cda0493458261D9': {
    name: '1inch',
    symbol: '1INCH',
    decimals: 8,
    quoteCurrency: 'ETH',
  },
  '0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012': {
    name: 'Aave',
    symbol: 'AAVE',
    decimals: 18,
    quoteCurrency: 'ETH',
  },
  '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9': {
    name: 'Aave',
    symbol: 'AAVE',
    decimals: 8,
    quoteCurrency: 'USD',
  },
  '0xFF3EEb22B5E3dE6e705b44749C2559d704923FD7': {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 8,
    quoteCurrency: 'USD',
  },
  '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A': {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 8,
    quoteCurrency: 'USD',
  },
  '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c': {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    quoteCurrency: 'USD',
  },
  '0x773616E4d11A78F511299002da57A0a94577F1f4': {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 18,
    quoteCurrency: 'ETH',
  },
  '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9': {
    name: 'DAI',
    symbol: 'DAI',
    decimals: 8,
    quoteCurrency: 'USD',
  },
  '0x2DE7E4a9488488e0058B95854CC2f7955B35dC9b': {
    name: 'Fantom',
    symbol: 'FTM',
    decimals: 18,
    quoteCurrency: 'ETH',
  },
  '0x7bAC85A8a13A4BcD8abb3eB7d6b4d632c5a57676': {
    name: 'Polygon(MATIC)',
    symbol: 'MATIC',
    decimals: 8,
    quoteCurrency: 'USD',
  },
  '0xEe9F2375b4bdF6387aa8265dD4FB8F16512A1d46': {
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 18,
    quoteCurrency: 'ETH',
  },
}

export const getTokenMetadata = (token: string) => {
  const findedToken = Object.keys(TOKENS).filter(
    (tokenAddr) => tokenAddr.toLowerCase() === token.toLowerCase(),
  )
  return TOKENS[findedToken[0]]
}
