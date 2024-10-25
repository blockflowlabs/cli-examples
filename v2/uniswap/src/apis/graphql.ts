
import { Resolver, Query, Ctx, ObjectType, Int, Arg, Field, ID } from "type-graphql";
import { Service } from "typedi";
import { API } from "@blockflow-labs/sdk";
import "reflect-metadata";
import { GPair } from "../types/graphql";
import { Pair } from "../types/generated";
import { GSwap } from "../types/graphql";
import { Swap } from "../types/generated";

@Service()
@Resolver(() => GPair)
export class PairResolver {
  @Query(() => [GPair])
  async getPairs(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GPair[]> {
    try {
      const client = API.PostgresClient(bind);
      const pairDB = await client.db(Pair);
      const res = await pairDB.find({limit:limit});
      return res as GPair[];
    } catch (error) {
      console.error(`Error in getPairs:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GSwap)
export class SwapResolver {
  @Query(() => [GSwap])
  async getSwaps(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GSwap[]> {
    try {
      const client = API.PostgresClient(bind);
      const swapDB = await client.db(Swap);
      const res = await swapDB.find({limit:limit});
      return res as GSwap[];
    } catch (error) {
      console.error(`Error in getSwaps:`, error);
      throw error;
    }
  }
}
