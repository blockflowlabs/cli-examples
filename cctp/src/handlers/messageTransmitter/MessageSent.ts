import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { attestationTable, IattestationTable } from "../../types/schema";
/**
 * @dev Event::MessageSent(bytes message)
 * @param context trigger object with contains {event: {message }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MessageSentHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for MessageSent here

  const { event, transaction, block, log } = context;
  const { message } = event;

  //id check
  let id = block.chain_id.toString();

  const attestationDB: Instance = bind(attestationTable);

  let attestation: IattestationTable = await attestationDB.findOne({
    id: id,
  });

  //attesatationhash remains
  attestation ??= await attestationDB.create({
    id: id,
    messageHash: message.toString(),
    timeStamp: block.block_timestamp,
  });

};
