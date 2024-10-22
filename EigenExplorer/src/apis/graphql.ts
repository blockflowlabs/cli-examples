
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

  import { GStaker } from "../types/types";
   import { Staker } from "../types/generated";

@Service()
@Resolver(() => GStaker)
export class StakerResolver {
  @Query(() => [GStaker])
  async getStakers(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GStaker[]> {
    console.log("Executing getStakers query");
    try {
      const client = API.PostgresClient(bind);
      const stakerDB = await client.db(Staker);
      const res = await stakerDB.find({});
      return res as GStaker[];
    } catch (error) {
      console.error("Error in getStakers:", error);
      throw error;
    }
  }
}

  import { GOperator } from "../types/types";
   import { Operator } from "../types/generated";

@Service()
@Resolver(() => GOperator)
export class OperatorResolver {
  @Query(() => [GOperator])
  async getOperators(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GOperator[]> {
    console.log("Executing getOperators query");
    try {
      const client = API.PostgresClient(bind);
      const operatorDB = await client.db(Operator);
      const res = await operatorDB.find({});
      return res as GOperator[];
    } catch (error) {
      console.error("Error in getOperators:", error);
      throw error;
    }
  }
}

  import { GAVS } from "../types/types";
   import { AVS } from "../types/generated";

@Service()
@Resolver(() => GAVS)
export class AVSResolver {
  @Query(() => [GAVS])
  async getAVSs(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GAVS[]> {
    console.log("Executing getAVSs query");
    try {
      const client = API.PostgresClient(bind);
      const avsDB = await client.db(AVS);
      const res = await avsDB.find({});
      return res as GAVS[];
    } catch (error) {
      console.error("Error in getAVSs:", error);
      throw error;
    }
  }
}

  import { GAvsOperator } from "../types/types";
   import { AvsOperator } from "../types/generated";

@Service()
@Resolver(() => GAvsOperator)
export class AvsOperatorResolver {
  @Query(() => [GAvsOperator])
  async getAvsOperators(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GAvsOperator[]> {
    console.log("Executing getAvsOperators query");
    try {
      const client = API.PostgresClient(bind);
      const avsoperatorDB = await client.db(AvsOperator);
      const res = await avsoperatorDB.find({});
      return res as GAvsOperator[];
    } catch (error) {
      console.error("Error in getAvsOperators:", error);
      throw error;
    }
  }
}

  import { GWithdrawal } from "../types/types";
   import { Withdrawal } from "../types/generated";

@Service()
@Resolver(() => GWithdrawal)
export class WithdrawalResolver {
  @Query(() => [GWithdrawal])
  async getWithdrawals(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GWithdrawal[]> {
    console.log("Executing getWithdrawals query");
    try {
      const client = API.PostgresClient(bind);
      const withdrawalDB = await client.db(Withdrawal);
      const res = await withdrawalDB.find({});
      return res as GWithdrawal[];
    } catch (error) {
      console.error("Error in getWithdrawals:", error);
      throw error;
    }
  }
}

  import { GDeposit } from "../types/types";
   import { Deposit } from "../types/generated";

@Service()
@Resolver(() => GDeposit)
export class DepositResolver {
  @Query(() => [GDeposit])
  async getDeposits(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GDeposit[]> {
    console.log("Executing getDeposits query");
    try {
      const client = API.PostgresClient(bind);
      const depositDB = await client.db(Deposit);
      const res = await depositDB.find({});
      return res as GDeposit[];
    } catch (error) {
      console.error("Error in getDeposits:", error);
      throw error;
    }
  }
}

  import { GEigenPod } from "../types/types";
   import { EigenPod } from "../types/generated";

@Service()
@Resolver(() => GEigenPod)
export class EigenPodResolver {
  @Query(() => [GEigenPod])
  async getEigenPods(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GEigenPod[]> {
    console.log("Executing getEigenPods query");
    try {
      const client = API.PostgresClient(bind);
      const eigenpodDB = await client.db(EigenPod);
      const res = await eigenpodDB.find({});
      return res as GEigenPod[];
    } catch (error) {
      console.error("Error in getEigenPods:", error);
      throw error;
    }
  }
}

  import { GPodTransactions } from "../types/types";
   import { PodTransactions } from "../types/generated";

@Service()
@Resolver(() => GPodTransactions)
export class PodTransactionsResolver {
  @Query(() => [GPodTransactions])
  async getPodTransactionss(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GPodTransactions[]> {
    console.log("Executing getPodTransactionss query");
    try {
      const client = API.PostgresClient(bind);
      const podtransactionsDB = await client.db(PodTransactions);
      const res = await podtransactionsDB.find({});
      return res as GPodTransactions[];
    } catch (error) {
      console.error("Error in getPodTransactionss:", error);
      throw error;
    }
  }
}

  import { GStats } from "../types/types";
   import { Stats } from "../types/generated";

@Service()
@Resolver(() => GStats)
export class StatsResolver {
  @Query(() => [GStats])
  async getStatss(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GStats[]> {
    console.log("Executing getStatss query");
    try {
      const client = API.PostgresClient(bind);
      const statsDB = await client.db(Stats);
      const res = await statsDB.find({});
      return res as GStats[];
    } catch (error) {
      console.error("Error in getStatss:", error);
      throw error;
    }
  }
}

  import { GStrategy } from "../types/types";
   import { Strategy } from "../types/generated";

@Service()
@Resolver(() => GStrategy)
export class StrategyResolver {
  @Query(() => [GStrategy])
  async getStrategys(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GStrategy[]> {
    console.log("Executing getStrategys query");
    try {
      const client = API.PostgresClient(bind);
      const strategyDB = await client.db(Strategy);
      const res = await strategyDB.find({});
      return res as GStrategy[];
    } catch (error) {
      console.error("Error in getStrategys:", error);
      throw error;
    }
  }
}

  import { GOperatorHistory } from "../types/types";
   import { OperatorHistory } from "../types/generated";

@Service()
@Resolver(() => GOperatorHistory)
export class OperatorHistoryResolver {
  @Query(() => [GOperatorHistory])
  async getOperatorHistorys(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GOperatorHistory[]> {
    console.log("Executing getOperatorHistorys query");
    try {
      const client = API.PostgresClient(bind);
      const operatorhistoryDB = await client.db(OperatorHistory);
      const res = await operatorhistoryDB.find({});
      return res as GOperatorHistory[];
    } catch (error) {
      console.error("Error in getOperatorHistorys:", error);
      throw error;
    }
  }
}

  import { GOperatorRestakeHistory } from "../types/types";
   import { OperatorRestakeHistory } from "../types/generated";

@Service()
@Resolver(() => GOperatorRestakeHistory)
export class OperatorRestakeHistoryResolver {
  @Query(() => [GOperatorRestakeHistory])
  async getOperatorRestakeHistorys(@Ctx() { bind }: any,
          @Arg("limit", () => Int, { nullable: true }) limit?: number,
          @Arg("page", () => Int, { nullable: true }) page?: number): Promise<GOperatorRestakeHistory[]> {
    console.log("Executing getOperatorRestakeHistorys query");
    try {
      const client = API.PostgresClient(bind);
      const operatorrestakehistoryDB = await client.db(OperatorRestakeHistory);
      const res = await operatorrestakehistoryDB.find({});
      return res as GOperatorRestakeHistory[];
    } catch (error) {
      console.error("Error in getOperatorRestakeHistorys:", error);
      throw error;
    }
  }
}
