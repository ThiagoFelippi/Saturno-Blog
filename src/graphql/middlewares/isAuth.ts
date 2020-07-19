import { MyContext } from '../../context/MyContext'
import { MiddlewareFn } from 'type-graphql'

import jwt from 'jsonwebtoken'

interface Decode{
  userId: number
}

export const isAuth : MiddlewareFn<MyContext> = async ({context}, next) => {
  const { authorization } = context.req.headers

  if(!authorization){
    throw new Error("Token not found")
  }

  const [ Bearer, token ] = authorization.split(" ")

  if(!Bearer || !token){
    throw new Error("Token mallformated")
  }

  try{
    const decode = jwt.verify(token, process.env.TOKEN_SECRET!)
    context.payload = decode as Decode
    return next()
  }catch(err){
    throw new Error(err)
  }
  
}