import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::OperatorSetParamsUpdated(uint8 quorumNumber, tuple operatorSetParams)
 * @param context trigger object with contains {event: {quorumNumber ,operatorSetParams }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorSetParamsUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorSetParamsUpdated here

  const { event, transaction, block, log } = context;
  const { quorumNumber, operatorSetParams } = event;
};
