interface TokenInfo {
    name: string;
    symbol: string;
    decimals: number;
  }

  export const TOKENS: Record<string, TokenInfo> = {
    "0xeA581cA64e4A384aE4dEA39bb083173CcBd2D817": {
      name: "Next",
      symbol: "NEXT",
      decimals: 18,
    }
};

export const getTokenMetadata = (token: string) => {
  const findedToken = Object.keys(TOKENS).filter(
    (tokenAddr) => tokenAddr.toLowerCase() === token.toLowerCase()
  );

  return TOKENS[findedToken[0]];
};