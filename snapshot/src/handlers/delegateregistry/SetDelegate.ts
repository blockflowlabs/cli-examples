import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { Delegation, IDelegation, Block, IBlock} from "../../types/schema";

/**
 * @dev Event::SetDelegate(address delegator, bytes32 id, address delegate)
 * @param context trigger object with contains {event: {delegator ,id ,delegate }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SetDelegateHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for SetDelegate here

  const { event, transaction, block, log } = context;
  const { delegator, id, delegate } = event;

  const delegationDB = bind(Delegation);
  const blockDB = bind(Block);

  let Id = `${delegator}-${id}-${delegate}`;
  let blockId = `${block.block_number}`;

  let delegation = await delegationDB.create({
    id: Id,
    delegator: delegator,
    space: id,
    delegate: delegate,
    timestamp: block.block_timestamp,
  });

  let blockData = await blockDB.create({ 
    id: blockId,
    number: block.block_number,
    timestamp: block.block_timestamp,
  });
};
