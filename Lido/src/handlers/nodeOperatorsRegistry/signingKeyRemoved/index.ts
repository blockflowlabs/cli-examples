import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import {
  ILidoNodeOperator,
  ILidoNodeOperatorSigningKey,
  LidoNodeOperator,
  LidoNodeOperatorSigningKey,
} from "../../../types/schema";
import { _loadLidoNodeOperatorEntity } from "../../../helpers";

/**
 * @dev Event::SigningKeyRemoved(uint256 operatorId, bytes pubkey)
 * @param context trigger object with contains {event: {operatorId ,pubkey }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SigningKeyRemovedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for SigningKeyRemoved here

  const { event, transaction, block, log } = context;
  const { operatorId, pubkey } = event;

  const lidoNodeOperatorDB: Instance = bind(LidoNodeOperator);
  const lidoNodeOperatorSigningKeyDB: Instance = bind(
    LidoNodeOperatorSigningKey
  );

  let operator: ILidoNodeOperator = await _loadLidoNodeOperatorEntity(
    lidoNodeOperatorDB,
    operatorId
  );

  let entity: ILidoNodeOperatorSigningKey =
    await lidoNodeOperatorSigningKeyDB.findOne({
      id: pubkey.toString(),
    });

  if (!entity) {
    entity = await lidoNodeOperatorSigningKeyDB.create({
      id: pubkey.toString(),
    });
    entity.operator_id = operatorId.toString();
    entity.operator = operator.id;
    entity.pubkey = pubkey.toString();
  }

  entity.removed = true;
  entity.block_timestamp = block.block_timestamp;
  entity.transaction_hash = transaction.transaction_hash;
  entity.log_index = log.log_index;

  await lidoNodeOperatorSigningKeyDB.save(entity);
};
