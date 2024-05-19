import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { IncentivesController } from "../../../types/schema";

/**
 * @dev Event::DistributionEndUpdated(uint256 newDistributionEnd)
 * @param context trigger object with contains {event: {newDistributionEnd }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const UserIndexUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for DistributionEndUpdated here

  const { event, transaction, block, log } = context;
  const { newDistributionEnd } = event;

  let incentiveControllerDB = bind(IncentivesController);
  let iController:IncentivesController = await incentiveControllerDB.findOne({
    id: event.address,
  });
  if (iController) {
    iController.emissionEndTimestamp = newDistributionEnd;
    await incentiveControllerDB.save(iController);
  }
};
