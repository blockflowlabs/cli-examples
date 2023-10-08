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
  if (!db["from"]) db["from"] = {};
  if (!db["to"]) db["to"] = {};
  // To get variable in database instance
  let from = db["from"];
  let to = db["to"];
  const zeroAddress = new BigNumber(0).toString();
  // To update a variable in database instance
  db["from"] = event.from;
  db["to"] = event.to;
  // Implement your event handler logic for Transfer here
  if (from.balance >= event.value) {
    if (to === zeroAddress) {
      //_burn(from, event.value);
      let fromBalance = new BigNumber(from.balance || 0);
      let value = new BigNumber(event.value || 0);
      fromBalance = fromBalance.minus(value);
      from.balance = fromBalance.toString();
    } else if (from === zeroAddress) {
      //_mint(to, event.value);
      let toBalance = new BigNumber(to.balance || 0);
      let value = new BigNumber(event.value || 0);
      toBalance = toBalance.plus(value);
      to.balance = toBalance.toString();
    } else {
      //_transfer(from, to, event.value);
      let fromBalance = new BigNumber(from.balance || 0);
      let toBalance = new BigNumber(to.balance || 0);
      let value = new BigNumber(event.value || 0);
      fromBalance = fromBalance.minus(value);
      toBalance = toBalance.plus(value);
      from.balance = fromBalance.toString();
      to.balance = toBalance.toString();
    }
  }
};
