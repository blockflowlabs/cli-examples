import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IWithdrawalClaimed, WithdrawalClaimed } from "../../../types/schema";

/**
 * @dev Event::WithdrawalClaimed(uint256 requestId, address owner, address receiver, uint256 amountOfETH)
 * @param context trigger object with contains {event: {requestId ,owner ,receiver ,amountOfETH }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalClaimedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for WithdrawalClaimed here

  const { event, transaction, block, log } = context;
  const { requestId, owner, receiver, amountOfETH } = event;

  const withdrawalClaimedDB: Instance = bind(WithdrawalClaimed);

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: IWithdrawalClaimed = await withdrawalClaimedDB.findOne({
    id: entityId,
  });

  if (!entity) {
    entity = await withdrawalClaimedDB.create({
      id: entityId,
    });

    entity.request_id = requestId;
    entity.owner = owner;
    entity.receiver = receiver;
    entity.amount_of_eth = amountOfETH;

    entity.block_timestamp = block.block_timestamp;
    entity.transaction_hash = transaction.transaction_hash;
    entity.log_index = log.log_index;
  }

  await withdrawalClaimedDB.save(entity);
};
