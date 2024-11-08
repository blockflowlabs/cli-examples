
import { Resolver, Query, Ctx, ObjectType, Int, Arg, Field, ID } from "type-graphql";
import { Service } from "typedi";
import { API } from "@blockflow-labs/sdk";
import "reflect-metadata";
import { GTransfer } from "../types/graphql";
import { Transfer } from "../types/schema";

@Service()
@Resolver(() => GTransfer)
export class TransferResolver {
  @Query(() => [GTransfer])
  async getTransfers(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GTransfer[]> {
    try {
      const client = API.PostgresClient(bind);
      const transferDB = await client.db(Transfer);
      const res = await transferDB.find({limit:limit});
      return res as GTransfer[];
    } catch (error) {
      console.error(`Error in getTransfers:`, error);
      throw error;
    }
  }
}
