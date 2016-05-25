import { apolloServer } from 'graphql-tools'
import Schema from './data/schema'
import Mocks from './data/mocks'

export default function (app) {
  app.use('/graphql', apolloServer({
    graphiql: true,
    pretty: true,
    schema: Schema,
    mocks: Mocks
  }))
}
