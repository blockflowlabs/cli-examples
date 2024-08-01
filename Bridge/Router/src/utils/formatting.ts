import { BigNumber } from "bignumber.js";

export const formatDecimals = (amount: any, decimals: string) =>
  new BigNumber(amount)
    .dividedBy(
      new BigNumber(10).pow(decimals), // as decimals can be ""
    )
    .toString();
