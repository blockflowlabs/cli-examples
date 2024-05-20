import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoNodeOperator, LidoNodeOperator } from "../../../types/schema";
import { _loadLidoNodeOperatorEntity } from "../../../helpers";

/**
 * @dev Event::NodeOperatorAdded(uint256 id, string name, address rewardAddress, uint64 stakingLimit)
 * @param context trigger object with contains {event: {id ,name ,rewardAddress ,stakingLimit }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorAddedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for NodeOperatorAdded here

  const { event, transaction, block, log } = context;
  const { id, name, rewardAddress, stakingLimit } = event;

  const lidoNodeOperatorDB: Instance = bind(LidoNodeOperator);

  let operator: ILidoNodeOperator = await _loadLidoNodeOperatorEntity(
    lidoNodeOperatorDB,
    id,
    true
  );

  operator.name = name.toString().toLowerCase();
  operator.reward_address = rewardAddress.toString().toLowerCase();
  operator.staking_limit = stakingLimit.toString();
  operator.active = true;

  operator.block_timestamp = block.block_timestamp;
  operator.transaction_hash = transaction.transaction_hash;
  operator.log_index = log.log_index;

  await lidoNodeOperatorDB.save(operator);
};
