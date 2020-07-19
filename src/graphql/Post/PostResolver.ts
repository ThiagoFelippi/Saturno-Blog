import { Resolver, Query, Mutation, Arg, InputType, Field, Subscription, PubSub, PubSubEngine, Root, ObjectType, Int, UseMiddleware, Ctx } from "type-graphql";

// Entitys
import { Post } from '../../entity/Post';
import { User } from './../../entity/User';

// Validation
import PostValidation from './utils/validate'

// Middlewares
import { isAuth } from './../middlewares/isAuth';
import { MyContext } from './../../context/MyContext';

// Input Post
@InputType()
class PostInput{

  @Field()
  title : string

  @Field()
  content : string

  @Field(() => Int, {nullable: true})
  user: User

}

@ObjectType()
class PubSubType{
    
  @Field()
  title : string

  @Field()
  content : string

  @Field(() => User, {nullable: true})
  user: User
}

@Resolver()
export class PostResolver{

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getAllPosts(){
    const posts = await Post.find()
    return posts
  }

  @Query(() => [Post])
  @UseMiddleware(isAuth)
  async getPostByUserId(
    @Ctx() { payload } : MyContext
  ){
    const posts = await Post.find({
      where: {
        user: {
          id : payload.userId
        }
      },
      relations: ["user"]
    })
    if(!posts.length){
      throw new Error("This user don't have posts")
    }
    return posts
  }
  
  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("data", () => PostInput) data : PostInput,
    @PubSub() pubSub: PubSubEngine,
    @Ctx() { payload } : MyContext
  ){
    try{
      await PostValidation.validate(data, {
        abortEarly: false
      })

      const postCreated = await Post.create({
        ...data,
        user: {
          id: payload.userId
        }
        
      }).save()
      await pubSub.publish("Post", postCreated)
      return postCreated
    }catch(err){
      return err
    }
   
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Ctx() { payload } : MyContext
  ){
    const removed = await Post.delete(payload.userId)
    if(!removed){
      throw new Error("Post not exists")
    }
    return !!removed
  }

  @Subscription(() => PubSubType, {
    topics: "Post",
    name: "Post"
  })
  async subPost(
    @Root() {title, content, user} : Post
  ) : Promise<PostInput> {
    return {
      title,
      content,
      user
    }
  }

}