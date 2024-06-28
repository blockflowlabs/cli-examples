import { IEventContext } from "@blockflow-labs/utils";
import { Domain } from "../../../types/schema";
/**
 * @dev Event::NewTTL(bytes32 node, uint64 ttl)
 * @param context trigger object with contains {event: {node ,ttl }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NewTTLHandler = async (context: IEventContext, bind: Function) => {
  // Implement your event handler logic for NewTTL here

  const { event, transaction, block, log } = context;
  const { node, ttl } = event;

  const domain = await bind(Domain).findOne({ id: node.toLowerCase()});
  if (!domain) {
    await bind(Domain).create({
      id: node.toLowerCase(),
      ttl: ttl.toString(),
      events:[node, transaction.transaction_hash,block.block_number]
    });
  } else {
    domain.ttl = ttl.toString();
    await domain.save();
  }
};
