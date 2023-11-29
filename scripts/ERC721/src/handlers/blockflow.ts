/**
 * @dev Event::Approval(address owner, address approved, uint256 tokenId)
 * @param instance database [key, value]
 * @param event trigger object with keys [owner ,approved ,tokenId ]
 */
export const ApprovalHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for Approval here
};

/**
 * @dev Event::ApprovalForAll(address owner, address operator, bool approved)
 * @param instance database [key, value]
 * @param event trigger object with keys [owner ,operator ,approved ]
 */
export const ApprovalForAllHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for ApprovalForAll here
};

/**
 * @dev Event::OwnershipTransferred(address previousOwner, address newOwner)
 * @param instance database [key, value]
 * @param event trigger object with keys [previousOwner ,newOwner ]
 */
export const OwnershipTransferredHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for OwnershipTransferred here
};

/**
 * @dev Event::Transfer(address from, address to, uint256 tokenId)
 * @param instance database [key, value]
 * @param event trigger object with keys [from ,to ,tokenId ]
 */
export const TransferHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["ownerships"]) db["ownerships"] = {};
  if (!db["tokens"]) db["tokens"] = {};
  if (!db["ownerships"][event.from]) db["ownerships"][event.from] = [];
  if (!db["ownerships"][event.to]) db["ownerships"][event.to] = [];
  if (!db["tokens"][event.tokenId]) db["tokens"][event.tokenId] = {};
  if (!db["tokens"][event.tokenId]["owners"])
    db["tokens"][event.tokenId]["owners"] = [];

  // To get variable in database instance
  let to = event.to;
  let from = event.from;
  let tokenId = event.tokenId;
  let ownerships = db["ownerships"];
  let tokens = db["tokens"];
  let owners = tokens[tokenId]["owners"];
  let fromTokens = ownerships[from];

  // Implement your event handler logic for Transfer here
  if (fromTokens.includes(tokenId)) {
    fromTokens.splice(fromTokens.indexOf(tokenId), 1);
  }
  ownerships[to].push(tokenId);
  owners.push(to);
  tokens[tokenId]["currentOwner"] = to;

  // To update a variable in database instance
  db["ownerships"] = ownerships;
  db["tokens"] = tokens;
};
