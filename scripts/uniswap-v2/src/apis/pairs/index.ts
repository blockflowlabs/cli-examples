/**
 * @param response your api endpoint object
 * @param instance the object that contains your instance id as keys, and instance db as value
 * @dev instance[instanceId] gives you instance db
 * @notice available instanceIds: [2c6a2c2c-c536-48d8-af20-5d95ce794c81]
 */
export const Handler = (response: any, instance: any, queryParams: any) => {
  // To access a instance database
  // const instance1DB = instance[2c6a2c2c-c536-48d8-af20-5d95ce794c81]
  // To init a variable in response
  // response['blah'] ??= {...instance1DB}
  // Implement your api handler logic here


    const instanceId = ''; // TODO:
    const instanceData = instance[instanceId];

    response = instanceData["pairs"];
};
