import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

import { Vault, IVault } from "../../types/schema"
/**
 * @dev Event::MinimumLockUpdated(uint256 newLock)
 * @param context trigger object with contains {event: {newLock }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const MinimumLockUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  // Implement your event handler logic for MinimumLockUpdated here

  const { event, transaction, block, log } = context
  const { newLock } = event

  const vaultDB: Instance = bind(Vault)
  const vaultId = `${block.chain_id.toString()}-"Vault"`

  let vault: IVault = await vaultDB.findOne({
    id: vaultId,
  })
  vault ??= await vaultDB.create({
    id: vaultId,
    name: "Vault",
    minimumLock: 0,
  })
  //provide default to all variables
  vault.minimumLock = newLock
  await vaultDB.save(vault)
}
