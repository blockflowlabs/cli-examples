import BigNumber from "bignumber.js";
/**
 * @dev Event::Approval(address src, address guy, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,guy ,wad ]
 */
export const ApprovalHandler = (db: any, event: any) => {
  // args: [arg1, arg2, arg3] = [src, guy, wad]

  // To init a variable in database instance
  if (!db["approvals"]) db["approvals"] = {};
  if (!db["approvals"][event["arg1"]]) db["approvals"][event["arg1"]] = {};
  if (!db["approvals"][event["arg2"]]) db["approvals"][event["arg2"]] = {};

  // Initialise the owner -> spender mapping
  if (!db["approvals"][event["arg1"]][event["arg2"]])
    db["approvals"][event["arg1"]][event["arg2"]] = new BigNumber(0).toString();

  // Initialise the spender -> owner mapping
  if (!db["approvals"][event["arg2"]][event["arg1"]])
    db["approvals"][event["arg2"]][event["arg1"]] = new BigNumber(0).toString();

  // To get variable in database instance
  let owner = db["approvals"][event["arg1"]];
  let spender = db["approvals"][event["arg2"]];

  // Implement your event handler logic for Approval here
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (event["arg1"] !== zeroAddress && event["arg2"] !== zeroAddress) {
    let value = new BigNumber(event["arg3"] || 0).toString();
    owner[event["arg2"]] = value; //  How much allowance owner has given to a particular spender
    spender[event["arg1"]] = value; // How much allowance spender has by particular owner
  }

  // To update a variable in database instance
  db["approvals"][event["arg1"]] = owner;
  db["approvals"][event["arg2"]] = spender;
};

/**
 * @dev Event::Transfer(address src, address dst, uint256 wad)
 * @param instance database [key, value]
 * @param event trigger object with keys [src ,dst ,wad ]
 */
export const TransferHandler = (db: any, event: any) => {
  // args: [arg1, arg2, arg3] = [src, dst, wad]

  // To init a variable in database instance
  if (!db["totalSupply"]) db["totalSupply"] = "0";
  if (!db["balances"]) db["balances"] = {};

  // To get variable in database instance
  let totalSupply = new BigNumber(db["totalSupply"] || 0);
  let balances = db["balances"];

  // Implement your event handler logic for Transfer here
  const zeroAddress = "0x0000000000000000000000000000000000000000";
  if (event["arg1"] === zeroAddress) {
    let toBalance = new BigNumber(balances[event["arg2"]] || 0);
    let value = new BigNumber(event["arg3"] || 0);
    toBalance = toBalance.plus(value);
    totalSupply = totalSupply.plus(value);
    balances[event["arg2"]] = toBalance.toString();
  } else if (event["arg2"] === zeroAddress) {
    let fromBalance = new BigNumber(balances[event["arg1"]] || 0);
    let value = new BigNumber(event["arg3"] || 0);
    fromBalance = fromBalance.minus(value);
    totalSupply = totalSupply.minus(value);
    balances[event["arg1"]] = fromBalance.toString();
  } else {
    let fromBalance = new BigNumber(balances[event["arg1"]] || 0);
    let toBalance = new BigNumber(balances[event["arg2"]] || 0);
    let value = new BigNumber(event["arg3"] || 0);
    fromBalance = fromBalance.minus(value);
    toBalance = toBalance.plus(value);
    balances[event["arg1"]] = fromBalance.toString();
    balances[event["arg2"]] = toBalance.toString();
  }

  // To update a variable in database instance
  db["totalSupply"] = totalSupply.toString();
  db["balances"] = balances;
};
