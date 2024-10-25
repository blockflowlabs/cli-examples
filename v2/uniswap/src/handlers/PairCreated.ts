import { Factory, Instance } from "@blockflow-labs/sdk";
import { IEventContext, ISecrets } from "@blockflow-labs/utils";
import { IPair, Pair } from "../types/generated";

/**
 * @dev Event::PairCreated(address token0, address token1, address pair, uint256 )
 * @param context trigger object with contains {event: {token0 ,token1 ,pair , }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PairCreatedHandler = async (
  context: IEventContext,
  bind: any,
  secrets: ISecrets
) => {
  // Implement your event handler logic for PairCreated here

  const { event, transaction, block, log } = context;
  const { token0, token1, pair } = event;

  const factory = new Factory(bind);
  await factory.create("pair", pair?.toString());

  const client = Instance.PostgresClient(bind);

  const pairDB = client.db(Pair);

  const entry: IPair = {
    token0: token0?.toString(),
    token1: token1?.toString(),
    pair: pair?.toString(),
    timestamp: block.block_timestamp,
  };

  await pairDB.save(entry);
};
