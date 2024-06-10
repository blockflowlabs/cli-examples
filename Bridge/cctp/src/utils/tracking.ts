import BigNumber from "bignumber.js";
import { Instance, IBind } from "@blockflow-labs/utils";

// prettier-ignore
import { cctpDayDataDB, cctpWeekDataDB, cctpMonthDataDB, cctpYearDataDB, cctpAllTimeDB } from "../types/schema";
// prettier-ignore
import { IcctpAllTimeDB, IcctpDayDataDB, IcctpMonthDataDB, IcctpWeekDataDB, IcctpYearDataDB } from "../types/schema";

export class Stats {
  fee: number;
  date: Date;
  amount: number;
  isMint: boolean;
  chainId: string;

  cctpDayDataDB: Instance;
  cctpWeekDataDB: Instance;
  cctpMonthDataDB: Instance;
  cctpYearDataDB: Instance;
  cctpAllTimeDB: Instance;

  constructor(
    isMint: boolean,
    chainId: string,
    amount: number,
    fee: number,
    timestamp: string,
    bind: IBind
  ) {
    this.fee = fee;
    this.isMint = isMint;
    this.amount = amount;
    this.chainId = chainId;
    this.date = new Date(Number(timestamp) * 1000);

    this.cctpAllTimeDB = bind(cctpAllTimeDB);
    this.cctpDayDataDB = bind(cctpDayDataDB);
    this.cctpYearDataDB = bind(cctpYearDataDB);
    this.cctpWeekDataDB = bind(cctpWeekDataDB);
    this.cctpMonthDataDB = bind(cctpMonthDataDB);
  }

  _getDate(): string {
    return this.date.toISOString().split("T")[0];
  }

  _getWeek(): number {
    return Math.floor(this.date.getTime() / 604800000);
  }

  _getMonth(): number {
    return this.date.getMonth() + 1;
  }

  _getYear(): number {
    return this.date.getFullYear();
  }

  async updateDailyData() {
    const date = this._getDate();
    let id = this.chainId.concat("_").concat(date);

    let entry: IcctpDayDataDB = await this.cctpDayDataDB.findOne({
      id,
    });

    entry ??= await this.cctpDayDataDB.create({
      id,
      date: date,
      txCount: "0",
      dailyVolume: "0",
      deposited: "0",
      withdrawal: "0",
      totalFee: "0",
    });

    entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
    entry.dailyVolume = new BigNumber(entry.dailyVolume)
      .plus(this.amount)
      .toString();

    if (this.isMint)
      entry.deposited = new BigNumber(entry.deposited)
        .plus(this.amount)
        .toString();
    else
      entry.withdrawal = new BigNumber(entry.withdrawal)
        .plus(this.amount)
        .toString();

    if (this.fee > 0)
      entry.totalFee = new BigNumber(entry.totalFee).plus(this.fee).toString();

    await this.cctpDayDataDB.save(entry);
  }

  async updateWeeklyData() {
    const week = this._getWeek();
    let id = this.chainId.concat("_").concat(week.toString());

    let entry: IcctpWeekDataDB = await this.cctpWeekDataDB.findOne({
      id: id,
    });
    entry ??= await this.cctpWeekDataDB.create({
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
      .plus(this.amount)
      .toString();

    if (this.isMint)
      entry.deposited = new BigNumber(entry.deposited)
        .plus(this.amount)
        .toString();
    else
      entry.withdrawal = new BigNumber(entry.withdrawal)
        .plus(this.amount)
        .toString();

    if (this.fee > 0)
      entry.totalFee = new BigNumber(entry.totalFee).plus(this.fee).toString();

    await this.cctpWeekDataDB.save(entry);
  }

  async updateMonthlyData() {
    const month = this._getMonth();
    const year = this._getYear();

    let id = this.chainId
      .concat("_")
      .concat(month.toString())
      .concat("_")
      .concat(year.toString());

    let entry: IcctpMonthDataDB = await this.cctpMonthDataDB.findOne({
      id: id.toLowerCase(),
    });
    entry ??= await this.cctpMonthDataDB.create({
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
      .plus(this.amount)
      .toString();

    if (this.isMint)
      entry.deposited = new BigNumber(entry.deposited)
        .plus(this.amount)
        .toString();
    else
      entry.withdrawal = new BigNumber(entry.withdrawal)
        .plus(this.amount)
        .toString();

    if (this.fee > 0)
      entry.totalFee = new BigNumber(entry.totalFee).plus(this.fee).toString();

    await this.cctpMonthDataDB.save(entry);
  }

  async updateYearlyData() {
    const year = this._getYear();
    let id = this.chainId.concat("_").concat(year.toString());

    let entry: IcctpYearDataDB = await this.cctpYearDataDB.findOne({
      id: id.toLowerCase(),
    });
    entry ??= await this.cctpYearDataDB.create({
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
      .plus(this.amount)
      .toString();

    if (this.isMint)
      entry.deposited = new BigNumber(entry.deposited)
        .plus(this.amount)
        .toString();
    else
      entry.withdrawal = new BigNumber(entry.withdrawal)
        .plus(this.amount)
        .toString();

    if (this.fee > 0)
      entry.totalFee = new BigNumber(entry.totalFee).plus(this.fee).toString();

    await this.cctpYearDataDB.save(entry);
  }

  async updateAllTimeData() {
    let entry: IcctpAllTimeDB = await this.cctpAllTimeDB.findOne({
      id: this.chainId,
    });
    entry ??= await this.cctpAllTimeDB.create({
      id: this.chainId,
      txCount: "0",
      allTimeVolume: "0",
      deposited: "0",
      withdrawal: "0",
      totalFee: "0",
    });

    entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
    entry.allTimeVolume = new BigNumber(entry.allTimeVolume)
      .plus(this.amount)
      .toString();

    if (this.isMint)
      entry.deposited = new BigNumber(entry.deposited)
        .plus(this.amount)
        .toString();
    else
      entry.withdrawal = new BigNumber(entry.withdrawal)
        .plus(this.amount)
        .toString();

    if (this.fee > 0)
      entry.totalFee = new BigNumber(entry.totalFee).plus(this.fee).toString();

    await this.cctpAllTimeDB.save(entry);
  }

  async update() {
    try {
      await this.updateDailyData();
      await this.updateWeeklyData();
      await this.updateYearlyData();
      await this.updateMonthlyData();
      await this.updateAllTimeData();
    } catch (error) {}
  }
}
