import {
  IEventContext,
  IBind,
  Instance,
  ISecrets,
} from "@blockflow-labs/utils";

import { LidoOracleMember, ILidoOracleMember } from "../../../types/schema";
import { _loadLidoOracleMemberEntity } from "../../../helpers";

/**
 * @dev Event::MemberAdded(address member)
 * @param context trigger object with contains {event: {member }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MemberAddedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for MemberAdded here

  const { event, transaction, block, log } = context;
  const { member } = event;

  const lidoOracleMemberDB: Instance = bind(LidoOracleMember);

  let oracleMember: ILidoOracleMember = await _loadLidoOracleMemberEntity(
    lidoOracleMemberDB,
    context,
  );

  await lidoOracleMemberDB.save(oracleMember);
};
