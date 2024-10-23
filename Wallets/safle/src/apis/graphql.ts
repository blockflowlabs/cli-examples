
import {  Resolver,
  Query,
  Ctx,
  ObjectType,
  Int,
  Arg,
  Field,
  InputType, } from "type-graphql";
import { Service } from "typedi";
import { API } from "@blockflow-labs/sdk";
import "reflect-metadata";

  import { GUserTransaction } from "../types/types";
   import { UserTransaction } from "../types/generated";

@Service()
@Resolver(() => GUserTransaction)
export class UserTransactionResolver {
  @Query(() => [GUserTransaction])
  async getUserTransactions(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GUserTransaction[]> {
    console.log("Executing getUserTransactions query");
    try {
      const client = API.PostgresClient(bind);
      const usertransactionDB = await client.db(UserTransaction);
      const res = await usertransactionDB.find({});
      return res as GUserTransaction[];
    } catch (error) {
      console.error("Error in getUserTransactions:", error);
      throw error;
    }
  }
}

  import { GuserStats } from "../types/types";
   import { userStats } from "../types/generated";

@Service()
@Resolver(() => GuserStats)
export class userStatsResolver {
  @Query(() => [GuserStats])
  async getuserStatss(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GuserStats[]> {
    console.log("Executing getuserStatss query");
    try {
      const client = API.PostgresClient(bind);
      const userstatsDB = await client.db(userStats);
      const res = await userstatsDB.find({});
      return res as GuserStats[];
    } catch (error) {
      console.error("Error in getuserStatss:", error);
      throw error;
    }
  }
}

  import { GTransaction } from "../types/types";
   import { Transaction } from "../types/generated";

@Service()
@Resolver(() => GTransaction)
export class TransactionResolver {
  @Query(() => [GTransaction])
  async getTransactions(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GTransaction[]> {
    console.log("Executing getTransactions query");
    try {
      const client = API.PostgresClient(bind);
      const transactionDB = await client.db(Transaction);
      const res = await transactionDB.find({});
      return res as GTransaction[];
    } catch (error) {
      console.error("Error in getTransactions:", error);
      throw error;
    }
  }
}

  import { GFactory } from "../types/types";
   import { Factory } from "../types/generated";

@Service()
@Resolver(() => GFactory)
export class FactoryResolver {
  @Query(() => [GFactory])
  async getFactorys(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GFactory[]> {
    console.log("Executing getFactorys query");
    try {
      const client = API.PostgresClient(bind);
      const factoryDB = await client.db(Factory);
      const res = await factoryDB.find({});
      return res as GFactory[];
    } catch (error) {
      console.error("Error in getFactorys:", error);
      throw error;
    }
  }
}

  import { GRegistration } from "../types/types";
   import { Registration } from "../types/generated";

@Service()
@Resolver(() => GRegistration)
export class RegistrationResolver {
  @Query(() => [GRegistration])
  async getRegistrations(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GRegistration[]> {
    console.log("Executing getRegistrations query");
    try {
      const client = API.PostgresClient(bind);
      const registrationDB = await client.db(Registration);
      const res = await registrationDB.find({});
      return res as GRegistration[];
    } catch (error) {
      console.error("Error in getRegistrations:", error);
      throw error;
    }
  }
}
