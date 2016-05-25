const typeDefinitions = `
scalar Url

type Query {
  user: User,
  organizations: [Organization],
  repos: [Repo],
  pullRequests(owner: String): [PullRequest]
}

type User {
  name: String,
  type: String,
  company: String,
  avatar: Url
}

type Organization {
  name: String
}

type Repo {
  owner: String,
  name: String,
  fullName: String,
  hasIssues: Boolean
},

type PullRequest {
  repo: Repo,
  url: Url,
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
