/**
 * @dev Event::PairCreated(address token0, address token1, address pair, uint256 )
 * @param instance database [key, value]
 * @param event trigger object with keys [token0 ,token1 ,pair , ]
 */
export const PairCreatedHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["pairs"]) db["pairs"] = {};
  if (!db["pairs"][event.token0]) db["pairs"][event.token0] = [];
  if (!db["pairs"][event.token1]) db["pairs"][event.token1] = [];
  if (!db["tokens"]) db["tokens"] = {};
  if (!db["tokens"][event["token0"]]) db["tokens"][event["token0"]] = {};
  if (!db["tokens"][event["token1"]]) db["tokens"][event["token1"]] = {};

  // To get variable in database instance
  let pairs = db["pairs"];
  let token0 = event.token0;
  let token1 = event.token1;
  let pair = event.pair;
  let index = event["arg4"];

  let tokens = db["tokens"];

  // Implement your event handler logic for PairCreated here
  pairs[token0].push(token1);
  pairs[token1].push(token0);

  tokens[token0][token1] = {
    pair: pair,
    index: index,
  };

  // To update a variable in database instance
  db["pairs"] = pairs;
  db["tokens"] = tokens;
};
