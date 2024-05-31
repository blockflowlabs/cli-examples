import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { PROTOCOL_UPG_BLOCKS } from "../../../constants";
import { ILidoTotalReward, LidoTotalReward } from "../../../types/schema";
import { _calcAPR_v1, _loadLidoTotalRewardEntity } from "../../../helpers";

/**
 * @dev Event::PostTotalShares(uint256 postTotalPooledEther, uint256 preTotalPooledEther, uint256 timeElapsed, uint256 totalShares)
 * @param context trigger object with contains {event: {postTotalPooledEther ,preTotalPooledEther ,timeElapsed ,totalShares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PostTotalSharesHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for PostTotalShares here

  const { event, transaction, block, log } = context;
  const {
    postTotalPooledEther,
    preTotalPooledEther,
    timeElapsed,
    totalShares,
  } = event;

  let isLidoV2 = block.block_number > PROTOCOL_UPG_BLOCKS["V2"];

  if (isLidoV2) {
    return;
  }

  const lidoTotalRewardDB: Instance = bind(LidoTotalReward);

  let entityId = `${transaction.transaction_hash}`.toLowerCase();

  let totalRewardEntity: ILidoTotalReward = await lidoTotalRewardDB.findOne({
    id: entityId,
  });

  if (!totalRewardEntity) {
    return;
  }

  totalRewardEntity.time_elapsed = timeElapsed.toString();

  const updatedTotalRewardEntity = _calcAPR_v1(
    totalRewardEntity,
    preTotalPooledEther.toString(),
    postTotalPooledEther.toString(),
    timeElapsed.toString(),
    totalRewardEntity.fee_basis
  );

  await lidoTotalRewardDB.save(updatedTotalRewardEntity);
};
