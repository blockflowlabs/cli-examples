
import { Resolver, Query, Ctx, ObjectType, Int, Arg, Field, ID } from "type-graphql";
import { Service } from "typedi";
import { API } from "@blockflow-labs/sdk";
import "reflect-metadata";
import { GUserTransaction } from "../types/graphql";
import { UserTransaction } from "../types/generated";
import { GuserStats } from "../types/graphql";
import { userStats } from "../types/generated";
import { GTransaction } from "../types/graphql";
import { Transaction } from "../types/generated";
import { GFactory } from "../types/graphql";
import { Factory } from "../types/generated";
import { GRegistration } from "../types/graphql";
import { Registration } from "../types/generated";

@Service()
@Resolver(() => GUserTransaction)
export class UserTransactionResolver {
  @Query(() => [GUserTransaction])
  async getUserTransactions(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GUserTransaction[]> {
    try {
      const client = API.PostgresClient(bind);
      const usertransactionDB = await client.db(UserTransaction);
      const res = await usertransactionDB.find({limit:limit});
      return res as GUserTransaction[];
    } catch (error) {
      console.error(`Error in getUserTransactions:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GuserStats)
export class userStatsResolver {
  @Query(() => [GuserStats])
  async getuserStatss(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GuserStats[]> {
    try {
      const client = API.PostgresClient(bind);
      const userstatsDB = await client.db(userStats);
      const res = await userstatsDB.find({limit:limit});
      return res as GuserStats[];
    } catch (error) {
      console.error(`Error in getuserStatss:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GTransaction)
export class TransactionResolver {
  @Query(() => [GTransaction])
  async getTransactions(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GTransaction[]> {
    try {
      const client = API.PostgresClient(bind);
      const transactionDB = await client.db(Transaction);
      const res = await transactionDB.find({limit:limit});
      return res as GTransaction[];
    } catch (error) {
      console.error(`Error in getTransactions:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GFactory)
export class FactoryResolver {
  @Query(() => [GFactory])
  async getFactorys(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GFactory[]> {
    try {
      const client = API.PostgresClient(bind);
      const factoryDB = await client.db(Factory);
      const res = await factoryDB.find({limit:limit});
      return res as GFactory[];
    } catch (error) {
      console.error(`Error in getFactorys:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GRegistration)
export class RegistrationResolver {
  @Query(() => [GRegistration])
  async getRegistrations(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GRegistration[]> {
    try {
      const client = API.PostgresClient(bind);
      const registrationDB = await client.db(Registration);
      const res = await registrationDB.find({limit:limit});
      return res as GRegistration[];
    } catch (error) {
      console.error(`Error in getRegistrations:`, error);
      throw error;
    }
  }
}
