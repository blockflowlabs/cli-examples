interface TokenInfo {
    name: string
    tokenURI: string
    owner: string
    tokenCount: number
    ownerCount: number
} 

export const TOKENS: Record<string, TokenInfo> = {
 
    "0x5Af0D9827E0c53E4799BB226655A1de152A425a5":{
        name: "Milady",
        tokenURI: "MIL",
        owner: "",
        tokenCount: 0,
        ownerCount: 0
    }
};
export const getTokenMetadata = (token: string) => {
    const findedToken = Object.keys(TOKENS).filter(
      (tokenAddr) => tokenAddr.toLowerCase() === token.toLowerCase(),
    )
    return TOKENS[findedToken[0]]
  }
  