import { Resolver, Query, Mutation, Arg, InputType, Field, Subscription, PubSub, PubSubEngine, Root, ObjectType } from "type-graphql";

// Entitys
import { User } from '../entity/User';

// Input User
@InputType()
class UserInput{

  @Field()
  name : string

  @Field()
  email : string

  @Field()
  password : string

}

// PubSub inputs & types
@InputType()
class PubSubInput{
  
  @Field()
  name : string

  @Field()
  email : string
  
}

@ObjectType()
class PubSubType{
    
  @Field()
  name : string

  @Field()
  email : string
}

@Resolver()
export class UserResolver{

  @Query(() => User)
  async getAllUsers(){
    const users = await User.find()
    return users
  }

  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data : UserInput,
    @PubSub() pubSub: PubSubEngine

  ){
    const userCreated = await User.create(data).save()
    await pubSub.publish("User", userCreated)
    return userCreated
  }

  @Subscription(() => PubSubType, {
    topics: "User",
    name: "User"
  })
  async subUser(
    @Root() {name, email} : User
  ) : Promise<PubSubInput> {
    return {
      name,
      email
    }
  }

}