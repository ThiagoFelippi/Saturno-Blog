import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm'
import { ObjectType, Field, Int } from 'type-graphql'
import { Min } from 'class-validator'
import { Post } from './Post';

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

  @Field(() => [Post], {
    nullable: true
  })
  @OneToMany(type => Post, post => post.user)
  @JoinColumn()
  post: Post[]

  @Field(() => [Post], {
    nullable: true
  })
  @ManyToMany(type => Post, likes => likes.likes)
  @JoinTable({
    name: "likes"
  })
  likes: Post[]

}