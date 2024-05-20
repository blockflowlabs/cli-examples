import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { ILidoNodeOperator, LidoNodeOperator } from "../../../types/schema";
import { _loadLidoNodeOperatorEntity } from "../../../helpers";

/**
 * @dev Event::NodeOperatorRewardAddressSet(uint256 id, address rewardAddress)
 * @param context trigger object with contains {event: {id ,rewardAddress }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const NodeOperatorRewardAddressSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for NodeOperatorRewardAddressSet here

  const { event, transaction, block, log } = context;
  const { id, rewardAddress } = event;
  const lidoNodeOperatorDB: Instance = bind(LidoNodeOperator);

  let operator: ILidoNodeOperator = await _loadLidoNodeOperatorEntity(
    lidoNodeOperatorDB,
    id
  );
  operator.reward_address = rewardAddress.toString().toLowerCase();

  await lidoNodeOperatorDB.save(operator);
};
