import BigNumber from "bignumber.js";
// /**
//  * @dev Event::Approval(address owner, address spender, uint256 value)
//  * @param instance database [key, value]
//  * @param context trigger object with contains [event: [owner ,spender ,value ], block, transaction]
//  */
// export const ApprovalHandler = (db: any, context: any) => {

//   // To init a variable in database instance
//   if (!db["approvals"]) db["approvals"] = {};
//   if (!db["approvals"][context.event.owner]) db["approvals"][context.event.owner] = {};
//   if (!db["approvals"][context.event.spender]) db["approvals"][context.event.spender] = {};

//   // Initialise the owner -> spender mapping
//   if (!db["approvals"][context.event.owner][context.event.spender])
//     db["approvals"][context.event.owner][context.event.spender] = new BigNumber(0).toString();

//   // Initialise the spender -> owner mapping
//   if (!db["approvals"][context.event.spender][context.event.owner])
//     db["approvals"][context.event.spender][context.event.owner] = new BigNumber(0).toString();

//   // To get variable in database instance
//   let owner = db["approvals"][context.event.owner];
//   let spender = db["approvals"][context.event.spender];

//   // Implement your event handler logic for Approval here
//   const zeroAddress = "0x0000000000000000000000000000000000000000";
//   if (context.event.owner !== zeroAddress && context.event.spender !== zeroAddress) {
//     let value = new BigNumber(context.event.value || 0).toString();
//     owner[context.event.spender] = value; //  How much allowance owner has given to a particular spender
//     spender[context.event.owner] = value; // How much allowance spender has by particular owner
//   }

//   // To update a variable in database instance
//   db["approvals"][context.event.owner] = owner;
//   db["approvals"][context.event.spender] = spender;
// };

/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param instance database [key, value]
 * @param context trigger object with contains [event: [from ,to ,value ], block, transaction]
 */
export const TransferHandler = (db: any, context: any) => {

  // To init a variable in database instance
  if (!db["totalSupply"]) db["totalSupply"] = "0";
  if (!db["balances"]) db["balances"] = {};

  // To get variable in database instance
  let totalSupply = new BigNumber(db["totalSupply"]);
  let balances = db["balances"];

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
  db["totalSupply"] = totalSupply.toString();
  db["balances"] = balances;
};
