interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export const TOKENS: Record<string, TokenInfo> = {
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": {
    name: "Wrapped BTC",
    symbol: "WBTC",
    decimals: 18,
  },
  "0x57e114B691Db790C35207b2e685D4A43181e6061": {
    name: "ENA",
    symbol: "ENA",
    decimals: 18,
  },
  "0xFe0c30065B384F05761f15d0CC899D4F9F9Cc0eB": {
    name: "ether.fi governance token",
    symbol: "ETHFI",
    decimals: 18,
  },
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  "0x66a0f676479cee1d7373f3dc2e2952778bff5bd6": {
    name: "Wise Token",
    symbol: "WISE",
    decimals: 18,
  },
  "0xdac17f958d2ee523a2206206994597c13d831ec7": {
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
  },
  "0x6b175474e89094c44da98b954eedeac495271d0f": {
    name: "Dai Stablecoin",
    symbol: "DAI",
    decimals: 18,
  },
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": {
    name: "Maker",
    symbol: "MKR",
    decimals: 18,
  },
  "0x853d955acef822db058eb8505911ed77f175b99e": {
    name: "Frax",
    symbol: "FRAX",
    decimals: 18,
  },
  "0x514910771af9ca656af840dff83e8264ecf986ca": {
    name: "ChainLink Token",
    symbol: "LINK",
    decimals: 18,
  },
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": {
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
  },
};

export const getTokenMetadata = (token: string) => {
  const findedToken = Object.keys(TOKENS).filter(
    (tokenAddr) => tokenAddr.toLowerCase() === token.toLowerCase(),
  );

  return TOKENS[findedToken[0]];
};
