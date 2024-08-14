import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

import { Vault, IVault } from "../../types/schema"
/**
 * @dev Event::PeripheryUpdated(address newPeriphery)
 * @param context trigger object with contains {event: {newPeriphery }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const PeripheryUpdatedHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context
  const { newPeriphery } = event

  const vaultDB: Instance = bind(Vault)
  const vaultId = `${block.chain_id.toString()}-"Vault"`

  let vault: IVault = await vaultDB.findOne({
    id: vaultId,
  })
  vault ??= await vaultDB.create({
    id: vaultId,
    name: "Vault",
    peripheryAddress: "",
  })
  vault.peripheryAddress = newPeriphery.toString()
  await vaultDB.save(vault)
}
