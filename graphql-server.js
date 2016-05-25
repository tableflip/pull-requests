import config from 'config'
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
  app.listen(config.graphQLPort, () => console.log(
    `GraphQL Server is now running on http://localhost:${config.graphQLPort}/graphql`
  ))
}
