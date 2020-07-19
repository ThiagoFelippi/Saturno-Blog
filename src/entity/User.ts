import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { Min } from 'class-validator'

@ObjectType()
@Entity()
export class User extends BaseEntity{

  @Field(() => Int)
  @Min(0)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name : string

  @Field()
  @Column()
  email : string

  @Field()
  @Column()
  password : string

}