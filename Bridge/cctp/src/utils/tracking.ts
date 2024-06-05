import { Instance } from "@blockflow-labs/utils";
import BigNumber from 'bignumber.js';

const today = new Date()
const date = today.toISOString().split('T')[0]
const week = Math.floor(Date.now() / 604800000)
const month = new Date().getMonth()
const year = new Date().getFullYear()

 export async function getTodayEntry(chainId: string, cctpDayDataDB: Instance, amount: number, totalFee: number)  {
 let id = chainId.concat("_").concat(date)
 let entry = await cctpDayDataDB.findOne({ id: id.toLowerCase() });
 entry ??= await cctpDayDataDB.create({
    id: chainId.concat("_").concat(date),
    date: date,
    txCount: "0",
    dailyVolume: "0",
    deposited: "0",
    withdrawal: "0",
    feeTotal: "0",
 });
 entry.txCount = new BigNumber(entry.txCount).plus(1).toString()
 entry.dailyVolume = new BigNumber(entry.dailyVolume).plus(amount).toString();
 if(totalFee){entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();}
 else{entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();}
 await cctpDayDataDB.save(entry);
}

export async function getWeeklyEntry(chainId:string, cctpWeekDataDB: Instance, amount: number, totalFee: number) {
    let id = chainId.concat("_").concat(week.toString())
    let entry = await cctpWeekDataDB.findOne({ id: id.toLowerCase() });
    entry ??= await cctpWeekDataDB.create({
        id: id,
        week: week.toString(),
        txCount: "0",
        weeklyVolume: "0",
        deposited: "0",
        withdrawal: "0",
        feeTotal: "0",
    });
    entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
    entry.weeklyVolume = new BigNumber(entry.weeklyVolume).plus(amount).toString();
    if(totalFee){entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();}
    else{entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();}
    await cctpWeekDataDB.save(entry);
}

export async function getMonthlyEntry(chainId:string, cctpMonthDataDB: Instance, amount: number, totalFee: number) {
   let id = chainId.concat("_").concat(month.toString()).concat("_").concat(year.toString())
    let entry = await cctpMonthDataDB.findOne({ id: id.toLowerCase() });
    entry ??= await cctpMonthDataDB.create({
        id: id,
        month: month.toString(),
        txCount: "0",
        monthlyVolume: "0",
        deposited: "0",
        withdrawal: "0",
        feeTotal: "0",
    });
    entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
    entry.monthlyVolume = new BigNumber(entry.monthlyVolume).plus(amount).toString();
    if(totalFee){entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();}
    else{entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();}
    await cctpMonthDataDB.save(entry);
}

export async function getYearlyEntry(chainId:string, cctpYearDataDB: Instance, amount: number, totalFee: number) {
    let id = chainId.concat("_").concat(year.toString())
    let entry = await cctpYearDataDB.findOne({ id: id.toLowerCase() });
    entry ??= await cctpYearDataDB.create({
        id: id,
        year: year.toString(),
        txCount: "0",
        yearlyVolume: "0",
        deposited: "0",
        withdrawal: "0",
        feeTotal: "0",
    });
    entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
    entry.yearlyVolume = new BigNumber(entry.yearlyVolume).plus(amount).toString();
    if(totalFee){entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();}
    else{entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();}
    await cctpYearDataDB.save(entry);
}

export async function getAllTimeEntry(chainId:string, cctpAllTimeDB: Instance, amount: number, totalFee: number) {
    let id = chainId
    let entry = await cctpAllTimeDB.findOne({ id: id.toLowerCase() });
    entry ??= await cctpAllTimeDB.create({
        id: id,
        txCount: "0",
        allTimeVolume: "0",
        deposited: "0",
        withdrawal: "0",
        feeTotal: "0",
    });
    entry.txCount = new BigNumber(entry.txCount).plus(1).toString();
    entry.allTimeVolume = new BigNumber(entry.allTimeVolume).plus(amount).toString();
    if(totalFee){entry.deposited = new BigNumber(entry.deposited).plus(amount).toString();}
    else{entry.withdrawal = new BigNumber(entry.withdrawal).plus(amount).toString();}
    await cctpAllTimeDB.save(entry);
}