import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@Entity()
@ObjectType()
export class GStaker extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  address?: string;

  @Column()
  @Field({ nullable: true })
  operator?: string;

  @Column()
  @Field({ nullable: true })
  shares?: any;

  @Column()
  @Field({ nullable: true })
  totalWithdrawals?: number;

  @Column()
  @Field({ nullable: true })
  totalDeposits?: number;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GOperator extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  address?: string;

  @Column()
  @Field({ nullable: true })
  details?: any;

  @Column()
  @Field({ nullable: true })
  metadataURI?: string;

  @Column()
  @Field({ nullable: true })
  metadataName?: string;

  @Column()
  @Field({ nullable: true })
  metadataDescription?: string;

  @Column()
  @Field({ nullable: true })
  metadataDiscord?: string;

  @Column()
  @Field({ nullable: true })
  metadataLogo?: string;

  @Column()
  @Field({ nullable: true })
  metadataTelegram?: string;

  @Column()
  @Field({ nullable: true })
  metadataWebsite?: string;

  @Column()
  @Field({ nullable: true })
  metadataX?: string;

  @Column()
  @Field({ nullable: true })
  isMetadataSynced?: boolean;

  @Column()
  @Field({ nullable: true })
  avsRegistrations?: any;

  @Column()
  @Field({ nullable: true })
  shares?: any;

  @Column()
  @Field({ nullable: true })
  totalStakers?: number;

  @Column()
  @Field({ nullable: true })
  totalAvs?: number;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GAVS extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  address?: string;

  @Column()
  @Field({ nullable: true })
  metadataURI?: string;

  @Column()
  @Field({ nullable: true })
  metadataName?: string;

  @Column()
  @Field({ nullable: true })
  metadataDescription?: string;

  @Column()
  @Field({ nullable: true })
  metadataDiscord?: string;

  @Column()
  @Field({ nullable: true })
  metadataLogo?: string;

  @Column()
  @Field({ nullable: true })
  metadataTelegram?: string;

  @Column()
  @Field({ nullable: true })
  metadataWebsite?: string;

  @Column()
  @Field({ nullable: true })
  metadataX?: string;

  @Column()
  @Field({ nullable: true })
  isMetadataSynced?: boolean;

  @Column()
  @Field({ nullable: true })
  activeOperators?: any;

  @Column()
  @Field({ nullable: true })
  inactiveOperators?: any;

  @Column()
  @Field({ nullable: true })
  totalOperators?: number;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GAvsOperator extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  rowId?: string;

  @Column()
  @Field({ nullable: true })
  avsAddress?: string;

  @Column()
  @Field({ nullable: true })
  operatorAddress?: string;

  @Column()
  @Field({ nullable: true })
  isActive?: boolean;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GWithdrawal extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  rowId?: string;

  @Column()
  @Field({ nullable: true })
  withdrawalRoot?: string;

  @Column()
  @Field({ nullable: true })
  nonce?: number;

  @Column()
  @Field({ nullable: true })
  stakerAddress?: string;

  @Column()
  @Field({ nullable: true })
  delegatedTo?: string;

  @Column()
  @Field({ nullable: true })
  withdrawerAddress?: string;

  @Column()
  @Field({ nullable: true })
  strategyShares?: any;

  @Column()
  @Field({ nullable: true })
  isCompleted?: boolean;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GDeposit extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  rowId?: string;

  @Column()
  @Field({ nullable: true })
  transactionHash?: string;

  @Column()
  @Field({ nullable: true })
  stakerAddress?: string;

  @Column()
  @Field({ nullable: true })
  tokenAddress?: string;

  @Column()
  @Field({ nullable: true })
  strategyAddress?: string;

  @Column()
  @Field({ nullable: true })
  shares?: string;

  @Column()
  @Field({ nullable: true })
  amount?: number;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GEigenPod extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  address?: string;

  @Column()
  @Field({ nullable: true })
  owner?: string;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GPodTransactions extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  rowId?: string;

  @Column()
  @Field({ nullable: true })
  podAddress?: string;

  @Column()
  @Field({ nullable: true })
  podOwner?: string;

  @Column()
  @Field({ nullable: true })
  transactionHash?: string;

  @Column()
  @Field({ nullable: true })
  sharesDelta?: string;

  @Column()
  @Field({ nullable: true })
  transactionIndex?: number;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GStats extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  statId?: string;

  @Column()
  @Field({ nullable: true })
  totalRegisteredAvs?: number;

  @Column()
  @Field({ nullable: true })
  totalActiveAvs?: number;

  @Column()
  @Field({ nullable: true })
  totalRegisteredOperators?: number;

  @Column()
  @Field({ nullable: true })
  totalActiveOperators?: number;

  @Column()
  @Field({ nullable: true })
  totalRegisteredStakers?: number;

  @Column()
  @Field({ nullable: true })
  totalActiveStakers?: number;

  @Column()
  @Field({ nullable: true })
  totalDepositWhitelistStrategies?: number;

  @Column()
  @Field({ nullable: true })
  totalCompletedWithdrawals?: number;

  @Column()
  @Field({ nullable: true })
  totalWithdrawals?: number;

  @Column()
  @Field({ nullable: true })
  totalDeposits?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GStrategy extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  address?: string;

  @Column()
  @Field({ nullable: true })
  symbol?: string;

  @Column()
  @Field({ nullable: true })
  underlyingToken?: any;

  @Column()
  @Field({ nullable: true })
  isDepositWhitelist?: boolean;

  @Column()
  @Field({ nullable: true })
  sharesToUnderlying?: string;

  @Column()
  @Field({ nullable: true })
  totalShares?: string;

  @Column()
  @Field({ nullable: true })
  totalAmount?: string;

  @Column()
  @Field({ nullable: true })
  totalDeposits?: number;

  @Column()
  @Field({ nullable: true })
  totalWithdrawals?: number;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GOperatorHistory extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  rowId?: string;

  @Column()
  @Field({ nullable: true })
  operatorAddress?: string;

  @Column()
  @Field({ nullable: true })
  avsAddress?: string;

  @Column()
  @Field({ nullable: true })
  event?: string;

  @Column()
  @Field({ nullable: true })
  transactionHash?: string;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
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

@Entity()
@ObjectType()
export class GOperatorRestakeHistory extends BaseEntity {
  @Column()
  @Field({ nullable: true })
  rowId?: string;

  @Column()
  @Field({ nullable: true })
  operatorAddress?: string;

  @Column()
  @Field({ nullable: true })
  stakerAddress?: string;

  @Column()
  @Field({ nullable: true })
  action?: string;

  @Column()
  @Field({ nullable: true })
  transactionHash?: string;

  @Column()
  @Field({ nullable: true })
  shares?: any;

  @Column()
  @Field({ nullable: true })
  createdAt?: number;

  @Column()
  @Field({ nullable: true })
  createdAtBlock?: number;

  @Column()
  @Field({ nullable: true })
  updatedAt?: number;

  @Column()
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
