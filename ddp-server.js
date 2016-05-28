import DDPServer from 'ddp-server-reactive'

export default function (server, github) {
  const ddpServer = new DDPServer({ httpServer: server })
  var users = ddpServer.publish('users')
  var repos = ddpServer.publish('repos')
  var owners = ddpServer.publish('owners')
  var pullRequests = ddpServer.publish('pullRequests')
  var loadingIndicator = ddpServer.publish('loadingIndicator')
  loadingIndicator[0] = { value: false }

  github.onNewToken = () => {
    loadingIndicator[0] = { value: true }
    github.getUser()
      .then((user) => { users[0] = user })
      .catch((err) => {
        console.error(err)
      })

    github.getRepos()
      .then((newRepos) => {
        var ownerSet = new Set()
        newRepos.forEach((repo, ind) => {
          repos[ind] = repo
          ownerSet.add(repo.owner.login)
        })
        ownerSet.forEach((owner, ind) => {
          owners[ind] = { _id: owner }
        })
        return github.getPullRequests(newRepos)
      })
      .then((newPRs) => {
        newPRs.forEach((pr, ind) => {
          pullRequests[ind] = pr
        })
        loadingIndicator[0] = { value: false }
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
