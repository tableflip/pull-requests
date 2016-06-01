import DDPServer from 'ddp-server-reactive'

export default function (server, github) {
  const ddpServer = new DDPServer({ httpServer: server })
  var users = ddpServer.publish('users')
  var repos = ddpServer.publish('repos')
  var owners = ddpServer.publish('owners')
  var pullRequests = ddpServer.publish('pullRequests')
  var loadingIndicator = ddpServer.publish('loadingIndicator')
  loadingIndicator[0] = { value: false }
  var repoStore = []
  var repoOwner = []

  ddpServer.methods({
    setOwner: function (owner) {
      if (owner === repoOwner) return
      repoOwner = owner
      loadingIndicator[0] = { value: true }
      Object.keys(pullRequests).forEach((prInd) => delete pullRequests[prInd])
      return getPRs()
        .then(() => {
          loadingIndicator[0] = { value: false }
        })
    }
  })

  function getPRs () {
    return github.getPullRequests(repoStore.filter((repo) => repoOwner.indexOf(repo.owner.login) > -1).map((repo) => repo.full_name))
      .then((newPRs) => {
        return newPRs.forEach((pr, ind) => {
          pullRequests[ind] = pr
        })
      })
  }

  github.onNewToken = () => {
    loadingIndicator[0] = { value: true }
    github.getUser()
      .then((user) => {
        users[0] = user
        repoOwner = [user.login]
      })
      .catch((err) => {
        console.error(err)
      })

    github.getRepos()
      .then((newRepos) => {
        var ownerSet = new Set()
        repoStore = newRepos
        newRepos.forEach((repo, ind) => {
          repos[ind] = repo
          ownerSet.add(repo.owner.login)
        })
        ownerSet.forEach((owner, ind) => {
          owners[ind] = { _id: owner }
        })
        loadingIndicator[0] = { value: true }
        return getPRs()
          .then(() => {
            loadingIndicator[0] = { value: false }
          })
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
