import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::OperatorStakeUpdate(bytes32 operatorId, uint8 quorumNumber, uint96 stake)
 * @param context trigger object with contains {event: {operatorId ,quorumNumber ,stake }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const OperatorStakeUpdateHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for OperatorStakeUpdate here

  const { event, transaction, block, log } = context;
  const { operatorId, quorumNumber, stake } = event;
};
