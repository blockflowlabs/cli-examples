import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import {
  ILidoNodeOperatorKeysOpIndex,
  LidoNodeOperatorKeysOpIndex,
} from "../../../types/schema";

/**
 * @dev Event::KeysOpIndexSet(uint256 keysOpIndex)
 * @param context trigger object with contains {event: {keysOpIndex }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const KeysOpIndexSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for KeysOpIndexSet here

  const { event, transaction, block, log } = context;
  const { keysOpIndex } = event;

  const lidoKeysOpsIndexSetDB: Instance = bind(LidoNodeOperatorKeysOpIndex);

  let entityId =
    `${transaction.transaction_hash}:${log.log_index}`.toLowerCase();

  let entity: ILidoNodeOperatorKeysOpIndex = await lidoKeysOpsIndexSetDB.create(
    {
      id: entityId,
    },
  );

  entity.index = keysOpIndex.toString();

  await lidoKeysOpsIndexSetDB.save(entity);
};
