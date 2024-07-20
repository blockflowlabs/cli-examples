import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";
import { IBridgeLimitsSet, BridgeLimitsSet } from "../../types/schema";

/**
 * @dev Event::BridgeLimitsSet(uint256 _mintingLimit, uint256 _burningLimit, address _bridge)
 * @param context trigger object with contains {event: {_mintingLimit ,_burningLimit ,_bridge }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const BridgeLimitsSetHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for BridgeLimitsSet here

  const { event, transaction, block, log } = context;
  const { _mintingLimit, _burningLimit, _bridge } = event;

  const bridgeLimitsSetDB: Instance = bind(BridgeLimitsSet);
  const bridgeId = `${_bridge.toString()}`.toLowerCase();

  let bridgedata = await bridgeLimitsSetDB.findOne({
    id: bridgeId,
  });
  if (!bridgeId) {
    bridgedata = await bridgeLimitsSetDB.create({
      id: bridgeId,
      mintingLimit: _mintingLimit,
      burningLimit: _burningLimit,
      bridge: _bridge,
      block_timestamp: block.block_timestamp,
      block_hash: block.block_hash,
      block_number: block.block_number,
    });
  } else {
    bridgedata.mintingLimit = _mintingLimit;
    bridgedata.burningLimit = _burningLimit;
    bridgedata.block_timestamp = block.block_timestamp;
    bridgedata.block_hash = block.block_hash;
    bridgedata.block_number = block.block_number;

    await bridgeLimitsSetDB.save(bridgedata);
  }
};
