/**
 * @dev Event::AnswerUpdated(int256 current, uint256 roundId, uint256 updatedAt)
 * @param instance database [key, value]
 * @param event trigger object with keys [current ,roundId ,updatedAt ]
 */
export const AnswerUpdatedHandler = (db: any, event: any) => {
  // To init a variable in database instance
  if (!db["ETH"]) db["ETH"] = {};

  // Initialze ETH/USD price mapping
  if (!db["ETH"]["USD"]) db["ETH"]["USD"] = {};

  // To get variable in database instance
  let ETH = db["ETH"];

  // Implement your event handler logic for AnswerUpdated here
  ETH["USD"]["price"] = event.current || event.arg0 || event["0"];
  ETH["USD"]["roundId"] = event.roundId || event.arg1 || event["1"];
  ETH["USD"]["updatedAt"] = event.updatedAt || event.arg2 || event["2"];

  // To update a variable in database instance
  db["ETH"] = ETH;
};
