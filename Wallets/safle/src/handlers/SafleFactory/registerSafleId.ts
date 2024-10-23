import { IFunctionContext, ISecrets } from "@blockflow-labs/utils";
import { Factory, Instance } from "@blockflow-labs/sdk";

import {
  Factory as fac,
  IFactory,
  IRegistration,
  Registration,
} from "../../types/generated";

/**
 * @dev Function::registerSafleId(address _userAddress, string _safleId)
 * @param context trigger object with contains {functionParams: {_userAddress ,_safleId }, transaction, block}
 * @param bind init function for database wrapper methods
 */
export const registerSafleIdHandler = async (
  context: IFunctionContext,
  bind: any,
  secrets: ISecrets
) => {
  // Implement your function handler logic for registerSafleId here
  const { functionParams, transaction, block } = context;
  const { _userAddress, _safleId } = functionParams;

  const factory = new Factory(bind);
  console.log(`safleId: ${_safleId}`);

  await factory.create("safleId", _userAddress);
  console.log(`address: ${_userAddress}`);

  const client = Instance.PostgresClient(bind);
  const facdb = client.db(fac);
  const regdb = client.db(Registration);
  const doc: IFactory = await facdb.load({
    factory: transaction.transaction_to_address.toLowerCase(),
  });

  if (!doc) {
    await facdb.save({
      factory: transaction.transaction_to_address.toLowerCase(),
      childs: [_userAddress.toLowerCase()],
      childCount: 1,
    });
  } else {
    doc.childs.push(_userAddress.toLowerCase());
    doc.childCount++;
    await facdb.save(doc);
  }

  const registration: IRegistration = {
    address: _userAddress.toLowerCase(),
    safleId: _safleId,
    factory: transaction.transaction_to_address.toLowerCase(),
  };

  await regdb.save(registration);
};
