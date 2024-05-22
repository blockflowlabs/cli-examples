import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  IWithdrawalQueueConfig,
  WithdrawalQueueConfig,
} from "../../../types/schema";
import { _loadWithdrawalQueueConfigEntity } from "../../../helpers";

/**
 * @dev Event::ContractVersionSet(uint256 version)
 * @param context trigger object with contains {event: {version }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const ContractVersionSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for ContractVersionSet here

  const { event, transaction, block, log } = context;
  const { version } = event;

  const withdrawalQueueConfigDB: Instance = bind(WithdrawalQueueConfig);

  let entity: IWithdrawalQueueConfig = await _loadWithdrawalQueueConfigEntity(
    withdrawalQueueConfigDB,
  );

  entity.contract_version = version;

  await withdrawalQueueConfigDB.save(entity);
};
