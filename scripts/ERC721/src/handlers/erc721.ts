/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param instance database [key, value]
 * @param context trigger object with contains [event: [from ,to ,value ], log, transaction, block]
 */
export const TransferHandler = (db: any, context: any) => {
  // To init a variable in database instance
  if (!db["holdings"]) db["holdings"] = {};
  if (!db["tokens"]) db["tokens"] = {};
  if (!db["holdings"][context.event.from]) db["holdings"][context.event.from] = [];
  if (!db["holdings"][context.event.to]) db["holdings"][context.event.to] = [];
  if (!db["tokens"][context.event.tokenId]) db["tokens"][context.event.tokenId] = {};
  if (!db["tokens"][context.event.tokenId]["pastOwners"])
    db["tokens"][context.event.tokenId]["pastOwners"] = [];

  // To get variable in database instance
  let to = context.event.to;
  let from = context.event.from;
  let tokenId = context.event.tokenId;
  let holdings = db["holdings"];
  let tokens = db["tokens"];
  let fromHoldings = holdings[from];

  // Implement your event handler logic for Transfer here
  if (fromHoldings.includes(tokenId)) {
    fromHoldings.splice(fromHoldings.indexOf(tokenId), 1);
  }
  holdings[to].push(tokenId);
  tokens[tokenId]["pastOwners"].push(from);
  tokens[tokenId]["currentOwner"] = to;

  // To update a variable in database instance
  db["holdings"] = holdings;
  db["tokens"] = tokens;
};
