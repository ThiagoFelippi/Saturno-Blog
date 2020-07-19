import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import http from 'http'

// Resolvers
import { UserResolver } from './graphql/User/UserResolver'

(async () => {
  const port = 4000
  const app = express()

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        UserResolver
      ]
    })
  })

  apolloServer.applyMiddleware({app})
  const server = http.createServer(app)
  apolloServer.installSubscriptionHandlers(server)

  await createConnection()

  server.listen(port, () => {
    console.log(`
      App is running at http://localhost:${port}
      GraphQL is running at http://localhost:${port}/graphql
    `)
  })

})()