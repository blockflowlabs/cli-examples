import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  IWithdrawalsFinalized,
  WithdrawalsFinalized,
} from "../../../types/schema";

/**
 * @dev Event::WithdrawalsFinalized(uint256 from, uint256 to, uint256 amountOfETHLocked, uint256 sharesToBurn, uint256 timestamp)
 * @param context trigger object with contains {event: {from ,to ,amountOfETHLocked ,sharesToBurn ,timestamp }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalsFinalizedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for WithdrawalsFinalized here

  const { event, transaction, block, log } = context;
  const { from, to, amountOfETHLocked, sharesToBurn, timestamp } = event;

  const withdrawalsFinalizedDB: Instance = bind(WithdrawalsFinalized);

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: IWithdrawalsFinalized = await withdrawalsFinalizedDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await withdrawalsFinalizedDB.create({
      id: entityId,
    });

    entity.from = from.toString();

    entity.to = to.toString();

    entity.amount_of_eth_locked = amountOfETHLocked.toString();

    entity.shares_to_burn = sharesToBurn.toString();

    entity.timestamp = timestamp.toString();

    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.log_index = log.log_index;
  }

  await withdrawalsFinalizedDB.save(entity);
};
