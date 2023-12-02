/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param instance database [key, value]
 * @param context trigger object contains [event: [from ,to ,value ], log, transaction, block]
 */
export const TransferHandler = (db: any, context: any) => {
  // To init a variable in database instance
  if (!db["balances"]) db["balances"] = {};
  if (!db["owners"]) db["owners"] = {};
  if (!db["balances"][context.event.from]) db["balances"][context.event.from] = [];
  if (!db["balances"][context.event.to]) db["balances"][context.event.to] = [];
  if (!db["owners"][context.event.tokenId]) db["owners"][context.event.tokenId] = {};
  if (!db["owners"][context.event.tokenId]["pastOwners"])
    db["owners"][context.event.tokenId]["pastOwners"] = [];

  // To get variable in database instance
  let to = context.event.to;
  let from = context.event.from;
  let tokenId = context.event.tokenId;
  let balances = db["balances"];
  let owners = db["owners"];
  let fromBalances = balances[from];

  // Implement your event handler logic for Transfer here
  if (fromBalances.includes(tokenId)) {
    fromBalances.splice(fromBalances.indexOf(tokenId), 1);
  }
  balances[to].push(tokenId);
  owners[tokenId]["pastOwners"].push(from);
  owners[tokenId]["currentOwner"] = to;

  // To update a variable in database instance
  db["balances"] = balances;
  db["owners"] = owners;
};
