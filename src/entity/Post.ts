import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { Min } from 'class-validator'

@ObjectType()
@Entity()
export class Post extends BaseEntity{

  @Field(() => Int)
  @Min(0)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  title : string

  @Field()
  @Column()
  content : string

}