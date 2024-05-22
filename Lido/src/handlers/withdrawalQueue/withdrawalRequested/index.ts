import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  IWithdrawalRequested,
  WithdrawalRequested,
} from "../../../types/schema";

/**
 * @dev Event::WithdrawalRequested(uint256 requestId, address requestor, address owner, uint256 amountOfStETH, uint256 amountOfShares)
 * @param context trigger object with contains {event: {requestId ,requestor ,owner ,amountOfStETH ,amountOfShares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalRequestedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for WithdrawalRequested here

  const { event, transaction, block, log } = context;
  const { requestId, requestor, owner, amountOfStETH, amountOfShares } = event;

  const withdrawalRequestedDB: Instance = bind(WithdrawalRequested);

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: IWithdrawalRequested = await withdrawalRequestedDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await withdrawalRequestedDB.create({
      id: entityId,
    });

    entity.request_id = requestId;

    entity.requestor = requestor;
    entity.owner = owner;
    entity.amount_of_StETH = amountOfStETH;
    entity.amount_of_shares = amountOfShares;

    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.log_index = log.log_index;
  }

  await withdrawalRequestedDB.save(entity);
};
