import { apolloServer } from 'graphql-tools'
import Schema from './data/schema'
import Resolvers from './data/resolvers'

export default function (app, github) {
  app.use('/graphql', apolloServer({
    graphiql: true,
    pretty: true,
    schema: Schema,
    resolvers: Resolvers
  }))
}
