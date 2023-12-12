import BigNumber from "bignumber.js";
import metadata from "../utils/metadata";

/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
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
    db[token]["owners"] = {};
  }
  if (!db[token]["balances"][context.event.from]) db[token]["balances"][context.event.from] = [];
  if (!db[token]["balances"][context.event.to]) db[token]["balances"][context.event.to] = [];
  if (!db[token]["owners"][context.event.tokenId])
    db[token]["owners"][context.event.tokenId] = {
      pastOwners: [],
      currentOwner: ""
    };

  // To get variable in database instance
  let to = context.event.to;
  let from = context.event.from;
  let tokenId = context.event.tokenId;
  let balances = db[token]["balances"];
  let owners = db[token]["owners"];
  let totalSupply = db[token]["totalSupply"];

  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (from === zeroAddress) {
    // mint
    totalSupply = new BigNumber(db[token]["totalSupply"]).plus(1).toString();
    balances[to].push(tokenId);
    owners[tokenId]["currentOwner"] = to;
  } else if (to === zeroAddress) {
    // burn
    totalSupply = new BigNumber(db[token]["totalSupply"]).minus(1).toString();
    balances[from].splice(balances[from].indexOf(tokenId), 1);
    owners[tokenId]["pastOwners"].push(from);
    owners[tokenId]["currentOwner"] = to;
  } else {
    // transfer
    balances[from].splice(balances[from].indexOf(tokenId), 1);
    balances[to].push(tokenId);
    owners[tokenId]["pastOwners"].push(from);
    owners[tokenId]["currentOwner"] = to;
  }

  // To update a variable in database instance
  db[token]["balances"] = balances;
  db[token]["owners"] = owners;
  db[token]["totalSupply"] = totalSupply;
};
