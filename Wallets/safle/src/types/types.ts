
import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@Entity()
@ObjectType()
export class GUserTransaction extends BaseEntity {

  @Column()
  @Field()
  address!: any;

  @Column()
  @Field()
  safleId!: any;

  @Column()
  @Field()
  transactionHash!: any;

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
export class GuserStats extends BaseEntity {

  @Column()
  @Field()
  address!: any;

  @Column()
  @Field()
  safleId!: any;

  @Column()
  @Field()
  transactionsCount!: any;

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
export class GTransaction extends BaseEntity {

  @Column()
  @Field()
  transaction_hash!: any;

  @Column()
  @Field({ nullable: true })
  transaction_nonce?: string;

  @Column()
  @Field({ nullable: true })
  transaction_index?: string;

  @Column()
  @Field({ nullable: true })
  transaction_from_address?: string;

  @Column()
  @Field({ nullable: true })
  transaction_to_address?: string;

  @Column()
  @Field({ nullable: true })
  transaction_value?: string;

  @Column()
  @Field({ nullable: true })
  transaction_gas?: string;

  @Column()
  @Field({ nullable: true })
  transaction_gas_price?: string;

  @Column()
  @Field({ nullable: true })
  transaction_input?: string;

  @Column()
  @Field({ nullable: true })
  transaction_receipt_cumulative_gas_used?: string;

  @Column()
  @Field({ nullable: true })
  transaction_receipt_gas_used?: string;

  @Column()
  @Field({ nullable: true })
  transaction_receipt_status?: string;

  @Column()
  @Field({ nullable: true })
  receipt_effective_gas_price?: string;

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
export class GFactory extends BaseEntity {

  @Column()
  @Field()
  childs!: any;

  @Column()
  @Field()
  factory!: any;

  @Column()
  @Field()
  childCount!: any;

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
export class GRegistration extends BaseEntity {

  @Column()
  @Field()
  address!: any;

  @Column()
  @Field()
  safleId!: any;

  @Column()
  @Field()
  factory!: any;

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

