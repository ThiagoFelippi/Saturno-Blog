import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, ManyToMany } from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { Min } from 'class-validator'
import { User } from './User';

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

  @Field(() => User, {
    nullable : true
  })
  @ManyToOne(type => User, user => user.post)
  @JoinColumn()
  user: User

  @Field(() => [User], {
    nullable: true
  })
  @ManyToMany(type => User, likes => likes.likes)
  likes: User[]

}