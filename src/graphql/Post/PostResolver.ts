import { Resolver, Query, Mutation, Arg, InputType, Field, Subscription, PubSub, PubSubEngine, Root, ObjectType, Int } from "type-graphql";

// Entitys
import { Post } from '../../entity/Post';

// Validation
import PostValidation from './utils/validate'

// Input Post
@InputType()
class PostInput{

  @Field()
  title : string

  @Field()
  content : string

}

// PubSub inputs & types
@InputType()
class PubSubInput{
  
  @Field()
  title : string

  @Field()
  content : string
  
}

@ObjectType()
class PubSubType{
    
  @Field()
  title : string

  @Field()
  content : string
}

@Resolver()
export class PostResolver{

  @Query(() => [Post])
  async getAllPosts(){
    const posts = await Post.find()
    return posts
  }

  @Query(() => Post)
  async getPostById(
    @Arg("id", () => Int) id : number
  ){
    const post = await Post.findOne(id)
    if(!post){
      throw new Error("Post not exists")
    }
    return post
  }
  
  @Mutation(() => Post)
  async createPost(
    @Arg("data", () => PostInput) data : PostInput,
    @PubSub() pubSub: PubSubEngine
  ){
    try{
      await PostValidation.validate(data, {
        abortEarly: false
      })
      const postCreated = await Post.create(data).save()
      await pubSub.publish("Post", postCreated)
      return postCreated
    }catch(err){
      return err
    }
   
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id", () => Int) id : number
  ){
    const removed = await Post.delete(id)
    return !!removed
  }

  @Subscription(() => PubSubType, {
    topics: "Post",
    name: "Post"
  })
  async subPost(
    @Root() {title, content} : Post
  ) : Promise<PubSubInput> {
    return {
      title,
      content
    }
  }

}