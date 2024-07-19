import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { LockBoxSet } from "../../types/schema";

/**
 * @dev Event::LockboxSet(address _lockbox)
 * @param context trigger object with contains {event: {_lockbox }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const LockboxSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for LockboxSet here

  const { event, transaction, block, log } = context;
  const { _lockbox } = event;

  const LockBoxSetDB: Instance = bind(LockBoxSet);
  let lockboxset = await LockBoxSetDB.findOne({
    id: _lockbox
  });
  //should lockbox id be the address itself only???
  if(!lockboxset){
    await LockBoxSetDB.create({
      id: _lockbox,
      lockboxaddress: _lockbox,
      block_timestamp: block.block_timestamp,
      block_hash: block.block_hash,
      block_number: block.block_number
    })
  }

};
