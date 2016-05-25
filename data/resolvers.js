export default  {
    Query: {
      user: () => {
        return null
        // return new Promise((resolve, reject) => {
        //   github.getUser((err, user) => {
        //     console.log(user)
        //     if (err) return reject(err)
        //     resolve(user)
        //   })
        // })
      },
      organizations: () => {},
      repos: () => {},
      pullRequests: () => {}
    },
    User: {
      avatar: (user) => user.avatar_url
    },
    Repo: {
      fullName: (repo) => repo.full_name,
      hasIssues: (repo) => repo.has_issues
    },
    PullRequest: {
      repo: (pr) => pr.repo,
      user: (pr) => pr.user,
      assignee: (pr) => pr.assignee,
      createdAt: (pr) => pr.created_at,
      updatedAt: (pr) => pr.updated_at
    }
  }
