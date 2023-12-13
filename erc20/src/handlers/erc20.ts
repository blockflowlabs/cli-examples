import BigNumber from "bignumber.js";
import metadata from "../utils/metadata";

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param instance database [key, value]
 * @param context trigger object contains [event: [from ,to ,value ], log, transaction, block]
 */
export const TransferHandler = (db: any, context: any) => {

  const token = context.log.log_address;

  // To init a variable in database instance
  if (!db[token]) {
    db[token] = metadata[token];
    db[token]["totalSupply"] = "0";
    db[token]["balances"] = {};
  }

  // To get variable in database instance
  let totalSupply = new BigNumber(db[token]["totalSupply"]);
  let balances = db[token]["balances"];

  // Implement your event handler logic for Transfer here
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (context.event.from === zeroAddress) {
    // mint
    let toBalance = new BigNumber(balances[context.event.to]);
    let value = new BigNumber(context.event.value);
    toBalance = toBalance.plus(value);
    totalSupply = totalSupply.plus(value);
    balances[context.event.to] = toBalance.toString();
  } else if (context.event.to === zeroAddress) {
    // burn
    let fromBalance = new BigNumber(balances[context.event.from] || 0);
    let value = new BigNumber(context.event.value || 0);
    fromBalance = fromBalance.minus(value);
    totalSupply = totalSupply.minus(value);
    balances[context.event.from] = fromBalance.toString();
  } else {
    // transfer
    let fromBalance = new BigNumber(balances[context.event.from] || 0);
    let toBalance = new BigNumber(balances[context.event.to] || 0);
    let value = new BigNumber(context.event.value || 0);
    fromBalance = fromBalance.minus(value);
    toBalance = toBalance.plus(value);
    balances[context.event.from] = fromBalance.toString();
    balances[context.event.to] = toBalance.toString();
  }

  // To update a variable in database instance
  db[token]["totalSupply"] = totalSupply.toString();
  db[token]["balances"] = balances;
};
