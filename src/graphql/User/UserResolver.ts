import { Resolver, Query, Mutation, Arg, InputType, Field, Subscription, PubSub, PubSubEngine, Root, ObjectType, Int } from "type-graphql";

// Entitys
import { User } from '../../entity/User';

// Validation
import UserValidation from './utils/validate'

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


@Resolver()
export class UserResolver{

  @Query(() => [User])
  async getAllUsers(){
    const users = await User.find({relations: ["post"]})
    return users
  }

  @Query(() => User)
  async getUserById(
    @Arg("id", () => Int) id : number
  ){
    const user = await User.findOne(id, {
      relations: ["post"]
    })
    if(!user){
      throw new Error("User not exists")
    }
    return user
  }
  
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data : UserInput
  ){
    try{
      await UserValidation.validate(data, {
        abortEarly: false
      })
      const userCreated = await User.create(data).save()
      return userCreated
    }catch(err){
      console.log(err)
      return err
    }
   
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id", () => Int) id : number
  ){
    const removed = await User.delete(id)
    return !!removed
  }

}