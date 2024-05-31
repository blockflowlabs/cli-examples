import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoConfig, LidoConfig } from "../../../types/schema";
import { _loadLidoConfigEntity } from "../../../helpers";

/**
 * @dev Event::WithdrawalCredentialsSet(bytes32 withdrawalCredentials)
 * @param context trigger object with contains {event: {withdrawalCredentials }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawalCredentialsSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for WithdrawalCredentialsSet here

  const { event, transaction, block, log } = context;
  const { withdrawalCredentials } = event;

  const lidoConfigDB: Instance = bind(LidoConfig);

  let entity: ILidoConfig = await _loadLidoConfigEntity(lidoConfigDB);

  entity.withdrawal_credentials = withdrawalCredentials.toLowerCase();

  await lidoConfigDB.save(entity);
};
