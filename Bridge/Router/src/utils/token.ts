import { IBind, Instance } from "@blockflow-labs/utils";
import { TokensInfo } from "../types/schema";
import { getTokenInfo } from "./helper";
import { fetchTokenInfo, fetchTokenPriceFromOracle } from "./node";

export const fetchTokenDetails = async (
  bind: IBind,
  chainId: string,
  address: string,
) => {
  if (!address || address === "0x") {
    return null;
  }
  const tokendb: Instance = bind(TokensInfo);
  let token = await tokendb.findOne({
    id: `${chainId}_${address}`.toLowerCase(),
  });
  if (!token) {
    const localToken = getTokenInfo(chainId, address);
    const fetchedTokenInfo =
      localToken && localToken.symbol
        ? localToken
        : await fetchTokenInfo(address, chainId);
    const priceUsd = await fetchTokenPriceFromOracle(fetchedTokenInfo.symbol);
    token = {
      id: `${chainId}_${address}`.toLowerCase(),
      chainId: chainId,
      address: address,
      decimals: fetchedTokenInfo.decimals,
      symbol: fetchedTokenInfo.symbol,
      priceRecordTimestamp: Math.floor(new Date().getTime() / 1000),
      priceUsd: "",
    };
    if (priceUsd) {
      token["priceUsd"] = priceUsd;
    }
    await tokendb.save(token);
    token = await tokendb.findOne({
      id: `${chainId}_${address}`.toLowerCase(),
    });
  } else {
    if (
      new Date().getTime() / 1000 - token.priceRecordTimestamp >
      15 * 60 * 60
    ) {
      const priceUsd = await fetchTokenPriceFromOracle(token.symbol);
      if (priceUsd) {
        token["priceUsd"] = priceUsd;
      }
      token["priceRecordTimestamp"] = Math.floor(new Date().getTime() / 1000);
      await tokendb.save(token);
      token = await tokendb.findOne({
        id: `${chainId}_${address}`.toLowerCase(),
      });
    }
  }
  return token;
};
