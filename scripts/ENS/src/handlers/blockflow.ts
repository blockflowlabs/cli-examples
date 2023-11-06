/**
 * @dev Event::NameRegistered(string name, bytes32 label, address owner, uint256 baseCost, uint256 premium, uint256 expires)
 * @param instance database [key, value]
 * @param event trigger object with keys [name ,label ,owner ,baseCost ,premium ,expires ]
 */
export const NameRegisteredHandler = (db: any, event: any, block: any) => {
  // To init a variable in database instance
  if (!db["ownerships"]) db["ownerships"] = {};
  if (!db["names"]) db["names"] = {};

  //Init ownerships to names mapping
  if (!db["ownerships"][event.owner]) db["ownerships"][event.owner] = [];

  //Init names object
  if (!db["names"][event.name]) db["names"][event.name] = {};

  // To get variable in database instance
  let ownerships = db["ownerships"];
  let names = db["names"];
  let name = names[event.name];
  let owner = ownerships[event.owner];
  let label = event.label;
  let baseCost = event.baseCost;
  let premium = event.premium;
  let expires = event.expires;

  // Implement your event handler logic for NameRegistered here

  // Updating the ownerships to names mapping
  owner.push(event.name);
  ownerships[event.owner] = owner;

  // Updating the names object
  name["label"] = label;
  name["owner"] = event.owner;
  name["baseCost"] = baseCost;
  name["premium"] = premium;
  name["expires"] = expires;
  name["createdAt"] = block.block_timestamp;
  names[event.name] = name;

  // To update a variable in database instance
  db["ownerships"] = ownerships;
  db["names"] = names;
};

/**
 * @dev Event::NameRenewed(string name, bytes32 label, uint256 cost, uint256 expires)
 * @param instance database [key, value]
 * @param event trigger object with keys [name ,label ,cost ,expires ]
 */
export const NameRenewedHandler = (db: any, event: any, block: any) => {
  // To init a variable in database instance
  if (!db["names"]) db["names"] = {};
  if (!db["names"][event.name]) db["names"][event.name] = {};

  //init renewalCosts array
  if (!db["names"][event.name]["renewalCosts"])
    db["names"][event.name]["renewalCosts"] = [];

  //init renewalAt array
  if (!db["names"][event.name]["renewalAt"])
    db["names"][event.name]["renewalAt"] = [];

  // To get variable in database instance
  let names = db["names"];
  let name = names[event.name];
  let cost = event.cost;
  let expires = event.expires;

  // Implement your event handler logic for NameRenewed here

  // Updating the names object
  name["renewalAt"] = [...name["renewalAt"], block.block_timestamp];
  name["renewalCosts"] = [...name["renewalCosts"], cost];
  name["expires"] = expires;
  names[event.name] = name;

  // To update a variable in database instance
  db["names"] = names;
};
