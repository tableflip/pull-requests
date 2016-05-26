import moment from 'moment'

function getRepoConstructor (github) {
  var repos = []

  return function getRepos () {
    if (repos.length) return Promise.resolve(repos)
    return github.getRepos().then((gotRepos) => {
      repos = gotRepos
      return gotRepos
    }).catch((err) => {
      throw err
    })
  }
}

export default function (github) {
  var getRepos = getRepoConstructor(github)

  return {
    Query: {
      user: () => {
        return github.getUser()
      },
      organizations: () => {},
      repos: () => {
        return getRepos()
      },
      pullRequests: (owner) => {
        return getRepos()
          .then((repos) => {
            let queryRepos = owner
              ? repos.filter(repo => repo.owner.login === owner)
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
