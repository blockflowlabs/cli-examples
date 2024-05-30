import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { IncentivesController } from "../../../types/schema";

/**
 * @dev Event::Initialized(address underlyingAsset, address pool, address treasury, address incentivesController, uint8 aTokenDecimals, string aTokenName, string aTokenSymbol, bytes params)
 * @param context trigger object with contains {event: {underlyingAsset ,pool ,treasury ,incentivesController ,aTokenDecimals ,aTokenName ,aTokenSymbol ,params }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const InitializedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Initialized here

  const { event, transaction, block, log } = context;
  const {
    underlyingAsset,
    pool,
    treasury,
    incentivesController,
    aTokenDecimals,
    aTokenName,
    aTokenSymbol,
    params,
  } = event;

  if (
    incentivesController.toString() ==
    "0x0000000000000000000000000000000000000000"
  ) {
    console.log(
      "Incentives controller is 0x0 for asset: {} | underlyingasset: {} | pool: {}",
      [event.address.toString(), underlyingAsset.toString(), pool.toString()],
    );
    return;
  }
};
