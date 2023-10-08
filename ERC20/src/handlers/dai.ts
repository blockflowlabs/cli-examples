import BigNumber from "bignumber.js";
/**
 * @dev Event::Approval(address src, address guy, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,guy ,wad ]
 */
export const ApprovalHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["owner"]) db["onwer"] = {};
  if (!db["spender"]) db["spender"] = {};
  // To get variable in database instance
  let owner = db["owner"];
  let spender = db["spender"];
  let zeroAddress = new BigNumber(0).toString();
  // To update a variable in database instance
  db["owner"] = event.owner;
  db["spender"] = event.spender;
  // Implement your event handler logic for Approval here
  if (owner !== zeroAddress && spender !== zeroAddress) {
    let ownerAllowance = new BigNumber(owner.allowance || 0);
    let value = new BigNumber(event.value || 0);
    ownerAllowance = ownerAllowance.plus(value);
    owner.allowance = ownerAllowance.toString();
  }
};

/**
 * @dev Event::LogNote(bytes4 sig, address usr, bytes32 arg1, bytes32 arg2, bytes data)
 * @param instance database [key, value]
 * @param event trigger object with keys [sig ,usr ,arg1 ,arg2 ,data ]
 */
export const LogNoteHandler = (db: any, event: any) => {
  // To init a variable in database instance
  // if(!db['from']) db['from'] = {}
  // To get variable in database instance
  // let from = db['from']
  // To update a variable in database instance
  // db['from'] = event.from || event.arg0 || event['0']
  // Implement your event handler logic for LogNote here
};

/**
 * @dev Event::Transfer(address src, address dst, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,dst ,wad ]
 */
export const TransferHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["totalSupply"]) db["totalSupply"] = "0"; //fetch from contract
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
