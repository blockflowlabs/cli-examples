
import { Resolver, Query, Ctx, ObjectType, Int, Arg, Field, ID } from "type-graphql";
import { Service } from "typedi";
import { API } from "@blockflow-labs/sdk";
import "reflect-metadata";
import { GStaker } from "../types/graphql";
import { Staker } from "../types/generated";
import { GOperator } from "../types/graphql";
import { Operator } from "../types/generated";
import { GAVS } from "../types/graphql";
import { AVS } from "../types/generated";
import { GAvsOperator } from "../types/graphql";
import { AvsOperator } from "../types/generated";
import { GWithdrawal } from "../types/graphql";
import { Withdrawal } from "../types/generated";
import { GDeposit } from "../types/graphql";
import { Deposit } from "../types/generated";
import { GEigenPod } from "../types/graphql";
import { EigenPod } from "../types/generated";
import { GPodTransactions } from "../types/graphql";
import { PodTransactions } from "../types/generated";
import { GStats } from "../types/graphql";
import { Stats } from "../types/generated";
import { GStrategy } from "../types/graphql";
import { Strategy } from "../types/generated";
import { GOperatorHistory } from "../types/graphql";
import { OperatorHistory } from "../types/generated";
import { GOperatorRestakeHistory } from "../types/graphql";
import { OperatorRestakeHistory } from "../types/generated";

@Service()
@Resolver(() => GStaker)
export class StakerResolver {
  @Query(() => [GStaker])
  async getStakers(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GStaker[]> {
    try {
      const client = API.PostgresClient(bind);
      const stakerDB = await client.db(Staker);
      const res = await stakerDB.find({limit:limit});
      return res as GStaker[];
    } catch (error) {
      console.error(`Error in getStakers:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GOperator)
export class OperatorResolver {
  @Query(() => [GOperator])
  async getOperators(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GOperator[]> {
    try {
      const client = API.PostgresClient(bind);
      const operatorDB = await client.db(Operator);
      const res = await operatorDB.find({limit:limit});
      return res as GOperator[];
    } catch (error) {
      console.error(`Error in getOperators:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GAVS)
export class AVSResolver {
  @Query(() => [GAVS])
  async getAVSs(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GAVS[]> {
    try {
      const client = API.PostgresClient(bind);
      const avsDB = await client.db(AVS);
      const res = await avsDB.find({limit:limit});
      return res as GAVS[];
    } catch (error) {
      console.error(`Error in getAVSs:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GAvsOperator)
export class AvsOperatorResolver {
  @Query(() => [GAvsOperator])
  async getAvsOperators(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GAvsOperator[]> {
    try {
      const client = API.PostgresClient(bind);
      const avsoperatorDB = await client.db(AvsOperator);
      const res = await avsoperatorDB.find({limit:limit});
      return res as GAvsOperator[];
    } catch (error) {
      console.error(`Error in getAvsOperators:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GWithdrawal)
export class WithdrawalResolver {
  @Query(() => [GWithdrawal])
  async getWithdrawals(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GWithdrawal[]> {
    try {
      const client = API.PostgresClient(bind);
      const withdrawalDB = await client.db(Withdrawal);
      const res = await withdrawalDB.find({limit:limit});
      return res as GWithdrawal[];
    } catch (error) {
      console.error(`Error in getWithdrawals:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GDeposit)
export class DepositResolver {
  @Query(() => [GDeposit])
  async getDeposits(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GDeposit[]> {
    try {
      const client = API.PostgresClient(bind);
      const depositDB = await client.db(Deposit);
      const res = await depositDB.find({limit:limit});
      return res as GDeposit[];
    } catch (error) {
      console.error(`Error in getDeposits:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GEigenPod)
export class EigenPodResolver {
  @Query(() => [GEigenPod])
  async getEigenPods(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GEigenPod[]> {
    try {
      const client = API.PostgresClient(bind);
      const eigenpodDB = await client.db(EigenPod);
      const res = await eigenpodDB.find({limit:limit});
      return res as GEigenPod[];
    } catch (error) {
      console.error(`Error in getEigenPods:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GPodTransactions)
export class PodTransactionsResolver {
  @Query(() => [GPodTransactions])
  async getPodTransactionss(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GPodTransactions[]> {
    try {
      const client = API.PostgresClient(bind);
      const podtransactionsDB = await client.db(PodTransactions);
      const res = await podtransactionsDB.find({limit:limit});
      return res as GPodTransactions[];
    } catch (error) {
      console.error(`Error in getPodTransactionss:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GStats)
export class StatsResolver {
  @Query(() => [GStats])
  async getStatss(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GStats[]> {
    try {
      const client = API.PostgresClient(bind);
      const statsDB = await client.db(Stats);
      const res = await statsDB.find({limit:limit});
      return res as GStats[];
    } catch (error) {
      console.error(`Error in getStatss:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GStrategy)
export class StrategyResolver {
  @Query(() => [GStrategy])
  async getStrategys(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GStrategy[]> {
    try {
      const client = API.PostgresClient(bind);
      const strategyDB = await client.db(Strategy);
      const res = await strategyDB.find({limit:limit});
      return res as GStrategy[];
    } catch (error) {
      console.error(`Error in getStrategys:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GOperatorHistory)
export class OperatorHistoryResolver {
  @Query(() => [GOperatorHistory])
  async getOperatorHistorys(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GOperatorHistory[]> {
    try {
      const client = API.PostgresClient(bind);
      const operatorhistoryDB = await client.db(OperatorHistory);
      const res = await operatorhistoryDB.find({limit:limit});
      return res as GOperatorHistory[];
    } catch (error) {
      console.error(`Error in getOperatorHistorys:`, error);
      throw error;
    }
  }
}

@Service()
@Resolver(() => GOperatorRestakeHistory)
export class OperatorRestakeHistoryResolver {
  @Query(() => [GOperatorRestakeHistory])
  async getOperatorRestakeHistorys(
    @Ctx() { bind }: any,
    @Arg("limit", () => Int, { nullable: true }) limit?: number,
    @Arg("page", () => Int, { nullable: true }) page?: number,
  ): Promise<GOperatorRestakeHistory[]> {
    try {
      const client = API.PostgresClient(bind);
      const operatorrestakehistoryDB = await client.db(OperatorRestakeHistory);
      const res = await operatorrestakehistoryDB.find({limit:limit});
      return res as GOperatorRestakeHistory[];
    } catch (error) {
      console.error(`Error in getOperatorRestakeHistorys:`, error);
      throw error;
    }
  }
}
