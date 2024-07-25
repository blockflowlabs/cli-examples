import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

/**
 * @dev Event::PreSignature(address owner, bytes orderUid, bool signed)
 * @param context trigger object with contains {event: {owner ,orderUid ,signed }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PreSignatureHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for PreSignature here

  const { event, transaction, block, log } = context;
  const { owner, orderUid, signed } = event;
};
