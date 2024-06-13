import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

import {
  Vault,
  IVault,
  User,
  IUser,
  dailyUserTrack,
  IdailyUserTrack,
  monthlyUserTrack,
  ImonthlyUserTrack,
  yearlyUserTrack,
  IyearlyUserTrack,
  dailyVolume,
  IdailyVolume,
  monthlyVolume,
  ImonthlyVolume,
  yearlyVolume,
  IyearlyVolume,
} from "../../types/schema"

import {
  dailyUserTrackHandler,
  monthlyUserTrackHandler,
  yearlyUserTrackHandler,
  dailyVolumeHandler,
  monthlyVolumeHandler,
  yearlyVolumeHandler,
} from "../../utils/tracker"
/**
 * @dev Event::Withdraw(address sender, address receiver, uint256 assets, uint256 shares)
 * @param context trigger object with contains {event: {sender ,receiver ,assets ,shares }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const WithdrawHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context
  const { sender, receiver, assets, shares } = event

  const userDB: Instance = bind(User)
  const vaultDB: Instance = bind(Vault)
  const dailyUserTrackDB: Instance = bind(dailyUserTrack)
  const monthlyUserTrackDB: Instance = bind(monthlyUserTrack)
  const yearlyUserTrackDB: Instance = bind(yearlyUserTrack)
  const dailyVolumeDB: Instance = bind(dailyVolume)
  const monthlyVolumeDB: Instance = bind(monthlyVolume)
  const yearlyVolumeDB: Instance = bind(yearlyVolume)

  const userId = `${receiver.toString()}`
  const vaultId = `${block.chain_id.toString()}-"Vault"`

  let vault: IVault = await vaultDB.findOne({
    id: vaultId,
  })
  let pricePerShare = vault.pricePerShare

  let user: IUser = await userDB.findOne({
    id: userId,
  })
  user ??= await userDB.create({
    id: userId,
    tokenBalance: 0,
    vaultBalance: 0,
    entryValue: 0,
    realizedEarnings: 0,
  })
  user.vaultBalance -= assets
  user.realizedEarnings = user.tokenBalance * pricePerShare - user.entryValue
  await userDB.save(user)

  vault ??= await vaultDB.create({
    id: vaultId,
    name: "Vault",
    vaultAddress: receiver.toString(),
    totalSupply: 0,
    totalHolding: 0,
    pricePerShare: 0,
    totalTokenEarnings: 0,
    minimumLock: 0,
    peripheryAddress: "",
  })
  vault.totalHolding -= assets
  vault.totalSupply -= shares
  vault.pricePerShare = vault.totalHolding / vault.totalSupply
  await vaultDB.save(vault)

  await dailyUserTrackHandler(
    userId,
    dailyUserTrackDB,
    block.block_timestamp,
    assets,
    assets,
  )
  await monthlyUserTrackHandler(
    userId,
    monthlyUserTrackDB,
    block.block_timestamp,
    assets,
    assets,
  )
  await yearlyUserTrackHandler(
    userId,
    yearlyUserTrackDB,
    block.block_timestamp,
    assets,
    assets,
  )
  await dailyVolumeHandler(
    dailyVolumeDB,
    block.block_timestamp,
    shares,
    vault.pricePerShare,
  )
  await monthlyVolumeHandler(
    monthlyVolumeDB,
    block.block_timestamp,
    shares,
    vault.pricePerShare,
  )
  await yearlyVolumeHandler(
    yearlyVolumeDB,
    block.block_timestamp,
    shares,
    vault.pricePerShare,
  )
}
