import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { LiqudityData } from "../../types/schema";
/**
 * @dev Event::Interaction(address target, uint256 value, bytes4 selector)
 * @param context trigger object with contains {event: {target ,value ,selector }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const InteractionHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Interaction here

  const { event, transaction, block, log } = context;
  const { target, value, selector } = event;

  const LiqudityDataDB: Instance = bind(LiqudityData);

  let liquiditydata = await LiqudityDataDB.create({
    id: transaction.transaction_hash,
    target: target,
    value: value,
    selector: selector,
  });
};
