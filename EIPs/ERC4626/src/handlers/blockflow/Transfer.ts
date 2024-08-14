import { IEventContext, IBind, Instance, ISecrets } from "@blockflow-labs/utils"

import {
  User,
  IUser,
  Token,
  IToken,
  Vault,
  IVault,
  dailyAPY,
  IdailyAPY,
  weeklyAPY,
  IweeklyAPY,
  monthlyAPY,
  ImonthlyAPY,
  yearlyAPY,
  IyearlyAPY,
} from "../../types/schema"
import {
  dailyAPYHandler,
  weeklyAPYHandler,
  monthlyAPYHandler,
  yearlyAPYHandler,
} from "../../utils/tracker"
/**
 * @dev Event::Transfer(address from, address to, uint256 value)
 * @param context trigger object with contains {event: {from ,to ,value }, transaction, block, log}
 * @param bind init function for database wrapper methods
 */
export const TransferHandler = async (
  context: IEventContext,
  bind: IBind,
  secrets: ISecrets,
) => {
  const { event, transaction, block, log } = context
  const { from, to, value } = event

  const userDB: Instance = bind(User)
  const vaultDB: Instance = bind(Vault)
  const tokenDB: Instance = bind(Token)
  const dailyAPYDB: Instance = bind(dailyAPY)
  const weeklyAPYDB: Instance = bind(weeklyAPY)
  const monthlyAPYDB: Instance = bind(monthlyAPY)
  const yearlyAPYDB: Instance = bind(yearlyAPY)

  const zeroAddress = "0x0000000000000000000000000000000000000000"
  const vaultId = `${block.chain_id.toString()}-"Vault"`
  const tokenId = `${log.log_address.toString()}`

  let token = await tokenDB.findOne({
    id: tokenId,
  })
  token ??= await tokenDB.create({
    id: tokenId,
    name: "Token",
    totalSupply: 0,
    multiplier: 0,
  })

  let vault: IVault = await vaultDB.findOne({
    id: vaultId,
  })
  vault ??= await vaultDB.create({
    id: vaultId,
    name: "Vault",
    vaultAddress: zeroAddress,
    totalSupply: 0,
    totalHolding: 0,
    pricePerShare: 0,
    totalTokenEarnings: 0,
    minimumLock: 0,
    peripheryAddress: "",
  })

  if (from != zeroAddress && to != zeroAddress) {
    const fromId = `${from.toString()}`
    const toId = `${to.toString()}`
    let fromUser: IUser = await userDB.findOne({
      id: fromId,
    })
    fromUser ??= await userDB.create({
      id: fromId,
      tokenBalance: 0,
    })
    fromUser.tokenBalance -= value
    await userDB.save(fromUser)
    let toUser: IUser = await userDB.findOne({
      id: toId,
    })
    toUser ??= await userDB.create({
      id: toId,
      tokenBalance: 0,
    })
    toUser.tokenBalance += value
    await userDB.save(toUser)
  } 
  
  else if (from != zeroAddress && to == zeroAddress) {
    const fromId = `${from.toString()}`
    let fromUser: IUser = await userDB.findOne({
      id: fromId,
    })
    fromUser ??= await userDB.create({
      id: fromId,
      tokenBalance: 0,
    })
    fromUser.tokenBalance -= value
    await userDB.save(fromUser)

    token.totalSupply -= value
    await tokenDB.save(token)

    let vaultuser = await userDB.findOne({
      id: log.log_address.toString(),
    })
    if (vaultuser) {
      if (from.toString() == vaultuser.id) {
        vault.totalTokenEarnings -= value
        await vaultDB.save(vault)
        await dailyAPYHandler(
          dailyAPYDB,
          block.block_timestamp,
          value,
          fromUser.tokenBalance,
        )
        await weeklyAPYHandler(
          weeklyAPYDB,
          block.block_timestamp,
          value,
          fromUser.tokenBalance,
        )
        await monthlyAPYHandler(
          monthlyAPYDB,
          block.block_timestamp,
          value,
          fromUser.tokenBalance,
        )
        await yearlyAPYHandler(
          yearlyAPYDB,
          block.block_timestamp,
          value,
          fromUser.tokenBalance,
        )
      }
    }
  }
  
  else if (from == zeroAddress && to != zeroAddress) {
    const toId = `${to.toString()}`
    let toUser: IUser = await userDB.findOne({
      id: toId,
    })
    toUser ??= await userDB.create({
      id: toId,
      tokenBalance: 0,
    })
    toUser.tokenBalance += value
    await userDB.save(toUser)

    token.totalSupply += value
    tokenDB.save(token)

    let vaultuser = await userDB.findOne({
      id: log.log_address.toString(),
    })
    if (vaultuser) {
      if (to.toString() == vaultuser.id) {
        vault.totalTokenEarnings += value
        await vaultDB.save(vault)
        await dailyAPYHandler(
          dailyAPYDB,
          block.block_timestamp,
          value,
          toUser.tokenBalance,
        )
        await weeklyAPYHandler(
          weeklyAPYDB,
          block.block_timestamp,
          value,
          toUser.tokenBalance,
        )
        await monthlyAPYHandler(
          monthlyAPYDB,
          block.block_timestamp,
          value,
          toUser.tokenBalance,
        )
        await yearlyAPYHandler(
          yearlyAPYDB,
          block.block_timestamp,
          value,
          toUser.tokenBalance,
        )
      }
    }
  }
}
