
import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@Entity("3126b1dc-db9c-4d45-93be-d3cce8898fc9-UserTransaction")
@ObjectType()
export class GUserTransaction extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: false })
  @Field()
  address!: string;
  @Column({ nullable: false })
  @Field()
  safleId!: string;
  @Column({ nullable: false })
  @Field()
  transactionHash!: string;
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

@Entity("3126b1dc-db9c-4d45-93be-d3cce8898fc9-userStats")
@ObjectType()
export class GuserStats extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: false })
  @Field()
  address!: string;
  @Column({ nullable: false })
  @Field()
  safleId!: string;
  @Column({ nullable: false })
  @Field()
  transactionsCount!: number;
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

@Entity("3126b1dc-db9c-4d45-93be-d3cce8898fc9-Transaction")
@ObjectType()
export class GTransaction extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: false })
  @Field()
  transaction_hash!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_nonce?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_index?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_from_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_to_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_value?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_gas?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_gas_price?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_input?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_receipt_cumulative_gas_used?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_receipt_gas_used?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_receipt_status?: string;
  @Column({ nullable: true })
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

@Entity("3126b1dc-db9c-4d45-93be-d3cce8898fc9-Factory")
@ObjectType()
export class GFactory extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column("simple-array")
  @Field(() => [String])
  childs!: string[];
  @Column({ nullable: false })
  @Field()
  factory!: string;
  @Column({ nullable: false })
  @Field()
  childCount!: number;
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

@Entity("3126b1dc-db9c-4d45-93be-d3cce8898fc9-Registration")
@ObjectType()
export class GRegistration extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: false })
  @Field()
  address!: string;
  @Column({ nullable: false })
  @Field()
  safleId!: string;
  @Column({ nullable: false })
  @Field()
  factory!: string;
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
