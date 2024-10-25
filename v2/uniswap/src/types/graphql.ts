
import { Entity, PrimaryColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@Entity("XXXX-XXXX-XXXX-XXXX-Pair")
@ObjectType()
export class GPair extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  token0?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  token1?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  pair?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  timestamp?: string;
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

@Entity("XXXX-XXXX-XXXX-XXXX-Swap")
@ObjectType()
export class GSwap extends BaseEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id!: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  sender?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  amount0In?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  amount1In?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  amount0Out?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  amount1Out?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  to?: string;
  @Column({ nullable: true })
  @Field({ nullable: true })
  pair?: string;
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
