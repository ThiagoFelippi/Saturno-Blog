import { Resolver, Query, Mutation, Arg, InputType, Field, Int, ObjectType } from "type-graphql";
import bcrypt from 'bcryptjs'

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

// Object User
@ObjectType()
class UserObject{
  @Field(() => User)
  user: User

  @Field()
  token: string
}

// JWT
const secret = process.env.TOKEN_SECRET!
import jwt from 'jsonwebtoken'

@Resolver()
export class UserResolver{

  @Query(() => [User])
  async getAllUsers(){
    const users = await User.find({relations: ["post"]})
    return users
  }

  @Mutation(() => UserObject)
  async login(
    @Arg("email", () => String) email : string
  ) : Promise<UserObject> {
    const user = await User.findOne({
      where: {email}
    })

    if(!user){
      throw new Error("User not exists")
    }

    const token = await jwt.sign({
      userId: user.id,
    }, secret , {
      expiresIn: 86400
    })

    return {
      user,
      token
    }
  }
  
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserInput) data : UserInput
  ){
    try{
      await UserValidation.validate(data, {
        abortEarly: false
      })
      
      const passwordHashed = await bcrypt.hash(data.password, 10)
      const userCreated = await User.create({
        ...data,
        password: passwordHashed
      }).save()
      
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