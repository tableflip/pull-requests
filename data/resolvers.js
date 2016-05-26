import moment from 'moment'

function getRepoConstructor (github) {
  var repos = []
  var resolver = Promise.resolve([])
  var running = false

  return function getRepos () {
    if (repos.length) return Promise.resolve(repos)
    if (running) return resolver
    running = true
    resolver = github.getRepos().then((gotRepos) => {
      running = false
      repos = gotRepos
      return gotRepos
    }).catch((err) => {
      throw err
    })
    return resolver
  }
}

export default function (github) {
  var getRepos = getRepoConstructor(github)

  return {
    Query: {
      user: () => {
        return github.getUser()
      },
      owners: () => {
        return getRepos()
          .then((repos) => {
            return [...repos.reduce((owners, repo) => {
              return owners.add(repo.owner.login)
            }, new Set())]
          })
      },
      repos: () => {
        return getRepos()
      },
      pullRequests: (_, { owner }) => {
        return getRepos()
          .then((repos) => {
            let queryRepos = owner
              ? repos.filter(repo => owner.some((login) => repo.owner.login === login))
              : repos
            return github.getPullRequests(queryRepos).then((prs) => {
              return prs.sort((prA, prB) => moment(prA.created_at).valueOf() - moment(prB.created_at).valueOf())
            })
          })
      }
    },
    User: {
      avatar: (user) => user.avatar_url,
      url: (user) => user.html_url
    },
    Repo: {
      fullName: (repo) => repo.full_name,
      hasIssues: (repo) => repo.has_issues,
      owner: (repo) => repo.owner.login,
      url: (repo) => repo.html_url
    },
    PullRequest: {
      repo: (pr) => pr.base.repo,
      user: (pr) => pr.user,
      assignee: (pr) => pr.assignee,
      createdAt: (pr) => pr.created_at,
      updatedAt: (pr) => pr.updated_at,
      url: (pr) => pr.html_url
    }
  }
}
