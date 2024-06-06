import BigNumber from "bignumber.js";
import { Instance } from "@blockflow-labs/utils";

import {
  IcctpAllTimeDB,
  IcctpDayDataDB,
  IcctpMonthDataDB,
  IcctpWeekDataDB,
  IcctpYearDataDB,
} from "../types/schema";

function _getDate(blockTimestamp: string): string {
  const BlockTimestamp = Number(blockTimestamp);
  const dateFromTimestamp = new Date(BlockTimestamp * 1000);
  return dateFromTimestamp.toISOString().split("T")[0];
}

function _getWeek(blockTimestamp: string): number {
  const BlockTimestamp = Number(blockTimestamp);
  const dateFromTimestamp = new Date(BlockTimestamp * 1000);
  return Math.floor(dateFromTimestamp.getTime() / 604800000);
}

function _getMonth(blockTimestamp: string): number {
  const BlockTimestamp = Number(blockTimestamp);
  const dateFromTimestamp = new Date(BlockTimestamp * 1000);
  return dateFromTimestamp.getMonth() + 1;
}

function _getYear(blockTimestamp: string): number {
  const BlockTimestamp = Number(blockTimestamp);
  const dateFromTimestamp = new Date(BlockTimestamp * 1000);
  return dateFromTimestamp.getFullYear();
}

export async function updateDailyData(
  chainId: string,
  cctpDayDataDB: Instance,
  amount: number,
  totalFee: number,
  blockTimestamp: string
) {
  const date = _getDate(blockTimestamp);
  let id = chainId.concat("_").concat(date);

  let entry: IcctpDayDataDB = await cctpDayDataDB.findOne({
    id,
  });
  entry ??= await cctpDayDataDB.create({
    id,
    date: date,
    txCount: "0",
    dailyVolume: "0",
    deposited: "0",
    withdrawal: "0",
    totalFee: "0",
  });

  entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
  entry.dailyVolume = new BigNumber(entry.dailyVolume).plus(amount).toString();

  if (totalFee) {
    entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();
    entry.totalFee = new BigNumber(entry.totalFee).plus(totalFee).toString();
  } else
    entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();

  await cctpDayDataDB.save(entry);
}

export async function updateWeeklyData(
  chainId: string,
  cctpWeekDataDB: Instance,
  amount: number,
  totalFee: number,
  blockTimestamp: string
) {
  const week = _getWeek(blockTimestamp);
  let id = chainId.concat("_").concat(week.toString());

  let entry: IcctpWeekDataDB = await cctpWeekDataDB.findOne({
    id: id,
  });
  entry ??= await cctpWeekDataDB.create({
    id: id,
    week: week.toString(),
    txCount: "0",
    weeklyVolume: "0",
    deposited: "0",
    withdrawal: "0",
    totalFee: "0",
  });

  entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
  entry.weeklyVolume = new BigNumber(entry.weeklyVolume)
    .plus(amount)
    .toString();

  if (totalFee) {
    entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();
    entry.totalFee = new BigNumber(entry.totalFee).plus(totalFee).toString();
  } else
    entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();

  await cctpWeekDataDB.save(entry);
}

export async function updateMonthlyData(
  chainId: string,
  cctpMonthDataDB: Instance,
  amount: number,
  totalFee: number,
  blockTimestamp: string
) {
  const month = _getMonth(blockTimestamp);
  const year = _getYear(blockTimestamp);
  let id = chainId
    .concat("_")
    .concat(month.toString())
    .concat("_")
    .concat(year.toString());

  let entry: IcctpMonthDataDB = await cctpMonthDataDB.findOne({
    id: id.toLowerCase(),
  });
  entry ??= await cctpMonthDataDB.create({
    id: id,
    month: month.toString(),
    txCount: "0",
    monthlyVolume: "0",
    deposited: "0",
    withdrawal: "0",
    totalFee: "0",
  });

  entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
  entry.monthlyVolume = new BigNumber(entry.monthlyVolume)
    .plus(amount)
    .toString();

  if (totalFee) {
    entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();
    entry.totalFee = new BigNumber(entry.totalFee).plus(totalFee).toString();
  } else
    entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();

  await cctpMonthDataDB.save(entry);
}

export async function updateYearlyData(
  chainId: string,
  cctpYearDataDB: Instance,
  amount: number,
  totalFee: number,
  blockTimestamp: string
) {
  const year = _getYear(blockTimestamp);
  let id = chainId.concat("_").concat(year.toString());

  let entry: IcctpYearDataDB = await cctpYearDataDB.findOne({
    id: id.toLowerCase(),
  });
  entry ??= await cctpYearDataDB.create({
    id: id,
    year: year.toString(),
    txCount: "0",
    yearlyVolume: "0",
    deposited: "0",
    withdrawal: "0",
    totalFee: "0",
  });

  entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
  entry.yearlyVolume = new BigNumber(entry.yearlyVolume)
    .plus(amount)
    .toString();

  if (totalFee) {
    entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();
    entry.totalFee = new BigNumber(entry.totalFee).plus(totalFee).toString();
  } else
    entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();

  await cctpYearDataDB.save(entry);
}

export async function updateAllTimeData(
  chainId: string,
  cctpAllTimeDB: Instance,
  amount: number,
  totalFee: number
) {
  let entry: IcctpAllTimeDB = await cctpAllTimeDB.findOne({ id: chainId });
  entry ??= await cctpAllTimeDB.create({
    id: chainId,
    txCount: "0",
    allTimeVolume: "0",
    deposited: "0",
    withdrawal: "0",
    totalFee: "0",
  });

  entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
  entry.allTimeVolume = new BigNumber(entry.allTimeVolume)
    .plus(amount)
    .toString();

  if (totalFee) {
    entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();
    entry.totalFee = new BigNumber(entry.totalFee).plus(totalFee).toString();
  } else
    entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();

  await cctpAllTimeDB.save(entry);
}
