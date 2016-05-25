const typeDefinitions = `
type Query {
  user: User
}
type User {
  name: String,
  type: String,
  company: String,
  avatar: String
}
schema {
  query: Query
}
`

export default [typeDefinitions]
