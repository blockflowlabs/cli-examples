import { IEventContext, Instance } from "@blockflow-labs/utils";

import { Registration } from "../../../types/schema";

/**
 * @dev Event::NameRegistered(uint256 id, address owner, uint256 expires)
 * @param context trigger object with contains {event: {id ,owner ,expires }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NameRegisteredHandler = async (
  context: IEventContext,
  bind: Function,
) => {
  // Implement your event handler logic for NameRegistered here

  const { event, transaction, block, log } = context;
  const { id, owner, expires } = event;

  const isoDate = new Date(Number(block.block_timestamp) * 1000).toISOString();

  const registrationDB: Instance = bind(Registration);

  let registration = await registrationDB.findOne({
    id: id.toString(),
  });
  if (!registration) {
    await registrationDB.create({
      id: id.toString(),
      domain: "",
      registrationDate: isoDate.toString(),
      expiryDate: expires.toString(),
      cost: "",
      registrant: owner,
      labelName: "",
    });
  }
  else{
    registration.registrant = owner;
    registration.events.push({
    id:id.toString(),
    blockNumber:block.block_number,
    transactionID:transaction.transaction_hash,
  });
  await registrationDB.save(registration);
  }
};
