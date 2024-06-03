interface TokenInfo {
  decimals: number;
  tokenName: string;
  tokenSymbol: string;
}

export const TOKENS: Record<string, TokenInfo> = {
  "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3": {
    decimals: 6,
    tokenName: "USD Ethena",
    tokenSymbol: "USDE",
  },
};

export const getTokenMetadata = (token: string) => {
  const findedToken = Object.keys(TOKENS).filter(
    (tokenAddr) => tokenAddr.toLowerCase() === token.toLowerCase(),
  );
  return TOKENS[findedToken[0]];
};
