import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { ILidoSubmission, LidoSubmission } from "../../../types/schema";

import { _loadLidoSubmissionEntity } from "../../../helpers";

/**
 * @dev Event::Submitted(address sender, uint256 amount, address referral)
 * @param context trigger object with contains {event: {sender ,amount ,referral }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const SubmittedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets
) => {
  // Implement your event handler logic for Submitted here

  const { event, transaction, block, log } = context;
  const { sender, amount, referral } = event;

  const lidoSubmissionDB: Instance = bind(LidoSubmission);

  const submission: ILidoSubmission = await _loadLidoSubmissionEntity(
    lidoSubmissionDB,
    context
  );

  await lidoSubmissionDB.save(submission);
};
