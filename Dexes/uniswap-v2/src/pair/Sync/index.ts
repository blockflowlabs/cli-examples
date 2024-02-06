import { IEventContext, IBind } from "@blockflow-labs/utils";

/**
 * @dev Event::Sync(uint112 reserve0, uint112 reserve1)
 * @param context trigger object with contains {event: {reserve0 ,reserve1 }, transaction, block, log}
 * @param bind init function for database wrapper class
 */
export const SyncHandler = async (context: IEventContext, bind: IBind) => {
  // Implement your event handler logic for Sync here

  const { event, transaction, block, log } = context;
  const { reserve0, reserve1 } = event;
};
