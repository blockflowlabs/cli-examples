import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { SolverData } from "../../types/schema";
/**
 * @dev Event::Settlement(address solver)
 * @param context trigger object with contains {event: {solver }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SettlementHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for Settlement here

  const { event, transaction, block, log } = context;
  const { solver } = event;

  const swapProtocolDataDB: Instance = bind(SolverData);

  let swapprotocoldata = await swapProtocolDataDB.create({
    id: solver,
    solverAddress: solver,
  });
};
