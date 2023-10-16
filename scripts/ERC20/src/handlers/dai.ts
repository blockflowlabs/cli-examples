import BigNumber from "bignumber.js";
/**
 * @dev Event::Approval(address src, address guy, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,guy ,wad ]
 */
export const ApprovalHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db[event.owner]) db[event.owner] = {};
  if (!db[event.spender]) db[event.spender] = {};

  // Initialise the owner -> spender mapping
  if (!db[event.owner][event.spender])
    db[event.owner][event.spender] = new BigNumber(0).toString();

  // Initialise the spender -> owner mapping
  if (!db[event.spender][event.owner])
    db[event.spender][event.owner] = new BigNumber(0).toString();

  // To get variable in database instance
  let owner = db[event.owner];
  let spender = db[event.spender];

  // Implement your event handler logic for Approval here
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (event.owner !== zeroAddress && event.spender !== zeroAddress) {
    let value = new BigNumber(event.value || 0).toString();
    owner[event.spender] = value; //  How much allowance owner has given to a particular spender
    spender[event.owner] = value; // How much allowance spender has by particular owner
  }

  // To update a variable in database instance
  db[event.owner] = owner;
  db[event.spender] = spender;
};

/**
 * @dev Event::Transfer(address src, address dst, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,dst ,wad ]
 */
export const TransferHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["totalSupply"]) db["totalSupply"] = "0";
  if (!db["balances"]) db["balances"] = {};

  // To get variable in database instance
  let totalSupply = new BigNumber(db["totalSupply"] || 0);
  let balances = db["balances"];

  // Implement your event handler logic for Transfer here
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (event.from === zeroAddress) {
    let toBalance = new BigNumber(balances[event.to] || 0);
    let value = new BigNumber(event.value || 0);
    toBalance = toBalance.plus(value);
    totalSupply = totalSupply.plus(value);
    balances[event.to] = toBalance.toString();
  } else if (event.to === zeroAddress) {
    let fromBalance = new BigNumber(balances[event.from] || 0);
    let value = new BigNumber(event.value || 0);
    fromBalance = fromBalance.minus(value);
    totalSupply = totalSupply.minus(value);
    balances[event.from] = fromBalance.toString();
  } else {
    let fromBalance = new BigNumber(balances[event.from] || 0);
    let toBalance = new BigNumber(balances[event.to] || 0);
    let value = new BigNumber(event.value || 0);
    fromBalance = fromBalance.minus(value);
    toBalance = toBalance.plus(value);
    balances[event.from] = fromBalance.toString();
    balances[event.to] = toBalance.toString();
  }

  // To update a variable in database instance
  db["totalSupply"] = totalSupply.toString();
  db["balances"] = balances;
};
