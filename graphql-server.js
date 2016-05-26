import { apolloServer } from 'graphql-tools'
import Schema from './data/schema'
// import Mocks from './data/mocks'
import Resolvers from './data/resolvers'

export default function (app, github) {
  app.use('/graphql', apolloServer({
    graphiql: true,
    pretty: true,
    schema: Schema,
    // mocks: Mocks
    resolvers: Resolvers(github)
  }))
}
