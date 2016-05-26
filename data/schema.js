const typeDefinitions = `

type Query {
  user: User,
  organizations: [Organization],
  repos: [Repo],
  pullRequests(owner: String): [PullRequest]
}

type User {
  name: String,
  login: String,
  type: String,
  company: String,
  avatar: String,
  url: String
}

type Organization {
  name: String
}

type Repo {
  owner: String,
  name: String,
  fullName: String,
  hasIssues: Boolean,
  url: String
},

type PullRequest {
  repo: Repo,
  url: String,
  user: User,
  assignee: User,
  title: String,
  body: String,
  createdAt: String,
  updatedAt: String
}

schema {
  query: Query
}
`

export default [typeDefinitions]
