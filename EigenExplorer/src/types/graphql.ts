
import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@ObjectType()
class StakerSharesItem {
    @Field({ nullable: true })
  strategy?: string;
  @Field({ nullable: true })
  shares?: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-Staker")
@ObjectType()
export class GStaker extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  operator?: string;
  @Column("json")
  @Field(() => [StakerSharesItem])
  shares!: StakerSharesItem[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalWithdrawals?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalDeposits?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@ObjectType()
class OperatorDetailsItem {
    @Field({ nullable: true })
  earningsReceiver?: string;
  @Field({ nullable: true })
  delegationApprover?: string;
  @Field({ nullable: true })
  stakerOptOutWindowBlocks?: number;
}

@ObjectType()
class OperatorAvsRegistrationsItem {
    @Field({ nullable: true })
  address?: string;
  @Field({ nullable: true })
  isActive?: boolean;
}

@ObjectType()
class OperatorSharesItem {
    @Field({ nullable: true })
  strategy?: string;
  @Field({ nullable: true })
  shares?: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-Operator")
@ObjectType()
export class GOperator extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;
  @Column("json")
  @Field(() => [OperatorDetailsItem])
  details!: OperatorDetailsItem[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataURI?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataName?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataDescription?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataDiscord?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataLogo?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataTelegram?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataWebsite?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataX?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  isMetadataSynced?: boolean;
  @Column("json")
  @Field(() => [OperatorAvsRegistrationsItem])
  avsRegistrations!: OperatorAvsRegistrationsItem[];
  @Column("json")
  @Field(() => [OperatorSharesItem])
  shares!: OperatorSharesItem[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalStakers?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalAvs?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-AVS")
@ObjectType()
export class GAVS extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataURI?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataName?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataDescription?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataDiscord?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataLogo?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataTelegram?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataWebsite?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  metadataX?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  isMetadataSynced?: boolean;
  @Column("simple-array")
  @Field(() => [String])
  activeOperators!: string[];
  @Column("simple-array")
  @Field(() => [String])
  inactiveOperators!: string[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalOperators?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-AvsOperator")
@ObjectType()
export class GAvsOperator extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  rowId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  avsAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  operatorAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  isActive?: boolean;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@ObjectType()
class WithdrawalStrategySharesItem {
    @Field({ nullable: true })
  strategy?: string;
  @Field({ nullable: true })
  shares?: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-Withdrawal")
@ObjectType()
export class GWithdrawal extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  rowId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  withdrawalRoot?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  nonce?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  stakerAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  delegatedTo?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  withdrawerAddress?: string;
  @Column("json")
  @Field(() => [WithdrawalStrategySharesItem])
  strategyShares!: WithdrawalStrategySharesItem[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  isCompleted?: boolean;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-Deposit")
@ObjectType()
export class GDeposit extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  rowId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transactionHash?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  stakerAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  tokenAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  strategyAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  shares?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  amount?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-EigenPod")
@ObjectType()
export class GEigenPod extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  owner?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-PodTransactions")
@ObjectType()
export class GPodTransactions extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  rowId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  podAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  podOwner?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transactionHash?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  sharesDelta?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transactionIndex?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-Stats")
@ObjectType()
export class GStats extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  statId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalRegisteredAvs?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalActiveAvs?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalRegisteredOperators?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalActiveOperators?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalRegisteredStakers?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalActiveStakers?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalDepositWhitelistStrategies?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalCompletedWithdrawals?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalWithdrawals?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalDeposits?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  minWithdrawalDelayBlocks?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@ObjectType()
class StrategyUnderlyingTokenItem {
    @Field({ nullable: true })
  address?: string;
  @Field({ nullable: true })
  symbol?: string;
  @Field({ nullable: true })
  name?: string;
  @Field({ nullable: true })
  decimals?: number;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-Strategy")
@ObjectType()
export class GStrategy extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  symbol?: string;
  @Column("json")
  @Field(() => [StrategyUnderlyingTokenItem])
  underlyingToken!: StrategyUnderlyingTokenItem[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  isDepositWhitelist?: boolean;
  @Column({ nullable: true })
  @Field({ nullable: true })
  sharesToUnderlying?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalShares?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalAmount?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalDeposits?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  totalWithdrawals?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-OperatorHistory")
@ObjectType()
export class GOperatorHistory extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  rowId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  operatorAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  avsAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  event?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transactionHash?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}

@ObjectType()
class OperatorRestakeHistorySharesItem {
    @Field({ nullable: true })
  strategy?: string;
  @Field({ nullable: true })
  shares?: string;
}

@Entity("63b0c62f-a9d2-44cb-be49-ea4f0156db25-OperatorRestakeHistory")
@ObjectType()
export class GOperatorRestakeHistory extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  rowId?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  operatorAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  stakerAddress?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  action?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transactionHash?: string;
  @Column("json")
  @Field(() => [OperatorRestakeHistorySharesItem])
  shares!: OperatorRestakeHistorySharesItem[];
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAtBlock?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAt?: number;
  @Column({ nullable: true })
  @Field({ nullable: true })
  updatedAtBlock?: number;
  @Column()
  @Field(() => Number)
  _blocknumber!: number;

  @Column()
  @Field()
  _blockhash!: string;

  @Column()
  @Field()
  _chainId!: string;

  @Column()
  @Field(() => Number)
  _version!: number;

  @Column()
  @Field()
  _refId!: string;
}
