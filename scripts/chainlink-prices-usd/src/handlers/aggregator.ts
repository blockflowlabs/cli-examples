import BigNumber from "bignumber.js";

/**
 * @dev Event::AnswerUpdated(int256 current, uint256 roundId, uint256 updatedAt)
 * @param db database [key, value]
 * @param context trigger object contains [event: [current ,roundId ,updatedAt ], log, transaction, block]
 */
export const AnswerUpdatedHandler = (db: any, context: any) => {
  const aggregatorToTokenSymbol = {
    "0xE62B71cf983019BFf55bC83B48601ce8419650CC": "ETH",
    "0xdBe1941BFbe4410D6865b9b7078e0b49af144D2d": "BTC",
    "0x478238a1c8B862498c74D0647329Aef9ea6819Ed": "DAI",
    "0xa964273552C1dBa201f5f000215F5BD5576e8f93": "USDT",
    "0x789190466E21a8b78b8027866CBBDc151542A26C": "USDC"
  }

  const aggregatorToDecimals = {
    "0xE62B71cf983019BFf55bC83B48601ce8419650CC": "8",
    "0xdBe1941BFbe4410D6865b9b7078e0b49af144D2d": "8",
    "0x478238a1c8B862498c74D0647329Aef9ea6819Ed": "8",
    "0xa964273552C1dBa201f5f000215F5BD5576e8f93": "8",
    "0x789190466E21a8b78b8027866CBBDc151542A26C": "8"
  }

  const aggregatorAddr = context.log.log_address;
  const tokenSymbol = aggregatorToTokenSymbol[aggregatorAddr];
  const decimals = aggregatorToDecimals[aggregatorAddr];
  
  // To init a variable in database instance
  if (!db[tokenSymbol]) db[tokenSymbol] = "0";

  // To update a variable in database instance
  db[tokenSymbol] = new BigNumber(context.event.current).div(new BigNumber(10).pow(decimals)).toString();
};
