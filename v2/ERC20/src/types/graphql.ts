
import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@Entity("XXXX-XXXX-XXXX-XXXX-Transfer")
@ObjectType()
export class GTransfer extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  from_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  to_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  token_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  token_name?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  token_symbol?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  raw_amount?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transfer_type?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_from_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_to_address?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  transaction_hash?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  log_index?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  block_timestamp?: string;
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
