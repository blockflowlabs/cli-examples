import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { NewPubKeyRegistration } from "../../types/schema";

/**
 * @dev Event::NewPubkeyRegistration(address operator, tuple pubkeyG1, tuple pubkeyG2)
 * @param context trigger object with contains {event: {operator ,pubkeyG1 ,pubkeyG2 }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewPubkeyRegistrationHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for NewPubkeyRegistration here

  const { event, transaction, block, log } = context;
  const { operator, pubkeyG1, pubkeyG2 } = event;

  const NewPubKeyRegistrationDB: Instance = bind(NewPubKeyRegistration);
  let Id = `${transaction.transaction_hash}-${log.log_index}`;
  const [g1x,g1y] = pubkeyG1;
  const [g2x,g2y] = pubkeyG2;

  let npkr = await NewPubKeyRegistrationDB.create({
    id: Id,
    operator: operator,
    pubkeyG1_X :g1x,
    pubkeyG1_Y: g1y,
    pubkeyG2_X: g2x,
    pubkeyG2_Y: g2y,
    blockNumber: block.block_number,
    blockTimestamp: block.block_timestamp,
    transactionHash: transaction.transaction_hash
  })
};
