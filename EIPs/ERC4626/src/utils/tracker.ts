import { Instance } from "@blockflow-labs/utils"

export async function dailyUserTrackHandler(
  userId: string,
  dailyUserTrack: Instance,
  blockTimestamp: string,
  assets: number,
  entryValue: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const date = dateFromTimestamp.toISOString().split("T")[0]
  let id = userId.concat("_").concat(date)
  let dailytrack = await dailyUserTrack.findOne({
    id: id,
  })
  dailytrack ??= await dailyUserTrack.create({
    id: id,
    userId: userId,
    dailyVaultBalance: 0,
    dailyEntryValue: 0,
  })
  dailytrack.dailyVaultBalance += assets
  dailytrack.dailyEntryValue += entryValue
  await dailyUserTrack.save(dailytrack)
}

export async function monthlyUserTrackHandler(
  userId: string,
  monthlyUserTrack: Instance,
  blockTimestamp: string,
  assets: number,
  entryValue: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const month = dateFromTimestamp.getMonth() + 1
  const year = dateFromTimestamp.getFullYear()
  let id = userId
    .concat("_")
    .concat(month.toString())
    .concat("_")
    .concat(year.toString())
  let monthlytrack = await monthlyUserTrack.findOne({
    id: id,
  })
  monthlytrack ??= await monthlyUserTrack.create({
    id: id,
    userId: userId,
    monthlyVaultBalance: 0,
    monthlyEntryValue: 0,
  })
  monthlytrack.monthlyVaultBalance += assets
  monthlytrack.monthlyEntryValue += entryValue
  await monthlyUserTrack.save(monthlytrack)
}

export async function yearlyUserTrackHandler(
  userId: string,
  yearlyUserTrack: Instance,
  blockTimestamp: string,
  assets: number,
  entryValue: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const year = dateFromTimestamp.getFullYear()
  let id = userId.concat("_").concat(year.toString())
  let yearlytrack = await yearlyUserTrack.findOne({
    id: id,
  })
  yearlytrack ??= await yearlyUserTrack.create({
    id: id,
    userId: userId,
    yearlyVaultBalance: 0,
    yearlyEntryValue: 0,
  })
  yearlytrack.yearlyVaultBalance += assets
  yearlytrack.yearlyEntryValue += entryValue
  await yearlyUserTrack.save(yearlytrack)
}

export async function dailyVolumeHandler(
  dailyVolume: Instance,
  blockTimestamp: string,
  shares: number,
  pricePerShare: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const date = dateFromTimestamp.toISOString().split("T")[0]
  let id = date
  let dailyvolume = await dailyVolume.findOne({
    id: id,
  })
  dailyvolume ??= await dailyVolume.create({
    id: id,
    dailyVaultTotalSupply: 0,
    dailyPricePerShare: 0,
  })
  dailyvolume.dailyVaultTotalSupply += shares
  dailyvolume.dailyPricePerShare += pricePerShare
  await dailyVolume.save(dailyvolume)
}

export async function monthlyVolumeHandler(
  monthlyVolume: Instance,
  blockTimestamp: string,
  shares: number,
  pricePerShare: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const month = dateFromTimestamp.getMonth() + 1
  const year = dateFromTimestamp.getFullYear()
  let id = month.toString().concat("_").concat(year.toString())
  let monthlyvolume = await monthlyVolume.findOne({
    id: id,
  })
  monthlyvolume ??= await monthlyVolume.create({
    id: id,
    monthlyVaultTotalSupply: 0,
    monthlyPricePerShare: 0,
  })
  monthlyvolume.monthlyVaultTotalSupply += shares
  monthlyvolume.monthlyPricePerShare += pricePerShare
  await monthlyVolume.save(monthlyvolume)
}

export async function yearlyVolumeHandler(
  yearlyVolume: Instance,
  blockTimestamp: string,
  shares: number,
  pricePerShare: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const year = dateFromTimestamp.getFullYear()
  let id = year.toString()
  let yearlyvolume = await yearlyVolume.findOne({
    id: id,
  })
  yearlyvolume ??= await yearlyVolume.create({
    id: id,
    yearlyVaultTotalSupply: 0,
    yearlyPricePerShare: 0,
  })
  yearlyvolume.yearlyVaultTotalSupply += shares
  yearlyvolume.yearlyPricePerShare += pricePerShare
  await yearlyVolume.save(yearlyvolume)
}

export async function dailyAPYHandler(
  dailyAPY: Instance,
  blockTimestamp: string,
  tokenEarnings: number,
  tokenBalance: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const date = dateFromTimestamp.toISOString().split("T")[0]
  let id = date
  let dailyapy = await dailyAPY.findOne({
    id: id,
  })
  dailyapy ??= await dailyAPY.create({
    id: id,
    dailyTokenEarnings: 0,
    averageTokenEarningsPerToken: 0,
    dailyAPYamount: 0,
  })
  dailyapy.dailyTokenEarnings += tokenEarnings
  dailyapy.averageTokenEarningsPerToken +=
    calculateaverageTokenEarningsPerToken(
      dailyapy.averageTokenEarningsPerToken,
      dailyapy.dailyTokenEarnings,
      tokenBalance,
    )
  const timeperyear = 365
  dailyapy.dailyAPYamount += caculateAPY(
    timeperyear,
    dailyapy.averageTokenEarningsPerToken,
  )
  await dailyAPY.save(dailyapy)
}

export async function weeklyAPYHandler(
  weeklyAPY: Instance,
  blockTimestamp: string,
  tokenEarnings: number,
  tokenBalance: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const week = Math.floor(dateFromTimestamp.getTime() / 604800000)
  const year = dateFromTimestamp.getFullYear()
  let id = week.toString().concat("_").concat(year.toString())
  let weeklyapy = await weeklyAPY.findOne({
    id: id,
  })
  weeklyapy ??= await weeklyAPY.create({
    id: id,
    weeklyTokenEarnings: 0,
    averageTokenEarningsPerToken: 0,
    weeklyAPYamount: 0,
  })
  weeklyapy.weeklyTokenEarnings += tokenEarnings
  weeklyapy.averageTokenEarningsPerToken +=
    calculateaverageTokenEarningsPerToken(
      weeklyapy.averageTokenEarningsPerToken,
      weeklyapy.weeklyTokenEarnings,
      tokenBalance,
    )
  const timeperyear = 52
  weeklyapy.weeklyAPYamount += caculateAPY(
    timeperyear,
    weeklyapy.averageTokenEarningsPerToken,
  )
  await weeklyAPY.save(weeklyapy)
}

export async function monthlyAPYHandler(
  monthlyAPY: Instance,
  blockTimestamp: string,
  tokenEarnings: number,
  tokenBalance: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const month = dateFromTimestamp.getMonth() + 1
  const year = dateFromTimestamp.getFullYear()
  let id = month.toString().concat("_").concat(year.toString())
  let monthlyapy = await monthlyAPY.findOne({
    id: id,
  })
  monthlyapy ??= await monthlyAPY.create({
    id: id,
    monthlyTokenEarnings: 0,
    averageTokenEarningsPerToken: 0,
    monthlyAPYamount: 0,
  })
  monthlyapy.monthlyTokenEarnings += tokenEarnings
  monthlyapy.averageTokenEarningsPerToken +=
    calculateaverageTokenEarningsPerToken(
      monthlyapy.averageTokenEarningsPerToken,
      monthlyapy.monthlyTokenEarnings,
      tokenBalance,
    )
  const timeperyear = 12
  monthlyapy.monthlyAPYamount += caculateAPY(
    timeperyear,
    monthlyapy.averageTokenEarningsPerToken,
  )
  await monthlyAPY.save(monthlyapy)
}

export async function yearlyAPYHandler(
  yearlyAPY: Instance,
  blockTimestamp: string,
  tokenEarnings: number,
  tokenBalance: number,
) {
  const BlockTimestamp = Number(blockTimestamp)
  const dateFromTimestamp = new Date(BlockTimestamp * 1000)
  const year = dateFromTimestamp.getFullYear()
  let id = year.toString()
  let yearlyapy = await yearlyAPY.findOne({
    id: id,
  })
  yearlyapy ??= await yearlyAPY.create({
    id: id,
    yearlyTokenEarnings: 0,
    averageTokenEarningsPerToken: 0,
    yearlyAPYamount: 0,
  })
  yearlyapy.yearlyTokenEarnings += tokenEarnings
  yearlyapy.averageTokenEarningsPerToken +=
    calculateaverageTokenEarningsPerToken(
      yearlyapy.averageTokenEarningsPerToken,
      yearlyapy.yearlyTokenEarnings,
      tokenBalance,
    )
  const timeperyear = 1
  yearlyapy.yearlyAPYamount += caculateAPY(
    timeperyear,
    yearlyapy.averageTokenEarningsPerToken,
  )
  await yearlyAPY.save(yearlyapy)
}

function calculateaverageTokenEarningsPerToken(
  averageTokenEarningsPerToken: number,
  dailyTokenEarnings: number,
  tokenBalance: number,
) {
  if (averageTokenEarningsPerToken == 0) {
    averageTokenEarningsPerToken = dailyTokenEarnings / tokenBalance
  } else {
    averageTokenEarningsPerToken =
      (averageTokenEarningsPerToken + dailyTokenEarnings / tokenBalance) / 2
  }
  return averageTokenEarningsPerToken
}

function caculateAPY(
  timeperyear: number,
  averageTokenEarningsPerToken: number,
) {
  return timeperyear * averageTokenEarningsPerToken * 100
}
