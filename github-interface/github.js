import parseGithubHeaders from 'parse-link-header'
import async from 'async'
import request from 'request'
import config from 'config'

var baseUrl = 'https://api.github.com'
var token = null

export default function (initToken) {
  token = initToken || token

  function githubCall (params, cb) {
    params = params || {}
    params.headers = params.headers || {}
    params.headers.Authorization = `token ${token}`
    params.headers.Accept = params.headers.Accept || 'application/vnd.github.v3+json'
    params.headers['User-Agent'] = config.appName
    request(params, cb)
  }

  function githubGet (url, cb) {
    githubCall({
      method: 'GET',
      url: `${baseUrl}${url}`
    }, cb)
  }

  var github = {
    setToken (newToken) {
      token = newToken
    },
    getUser (cb) {
      if (!cb) throw new Error('Please supply a callback function')
      githubGet('/user', (err, res, body) => {
        if (err) return cb(err)
        cb(null, JSON.parse(body))
      })
    },
    getRepos (cb) {
      if (!cb) throw new Error('Please supply a callback function')
      let repos = []
      let q = async.queue((url, done) => {
        githubGet(url, (err, res, body) => {
          if (err) return done(err)
          if (!body) return done()
          repos = repos.concat(JSON.parse(body))
          let headers = parseGithubHeaders(res.headers.link)
          if (headers && headers.next) q.push(headers.next.url)
          done()
        })
      })
      q.push('/user/repos?per_page=100')
      q.drain = function () {
        cb(null, repos)
      }
    },
    getPullRequests (repos, cb) {
      if (!cb) throw new Error('Please supply a callback function')
      let pulls = []
      let q = async.queue((url, done) => {
        githubGet(url, (err, res, body) => {
          if (err) return done(err)
          if (!body) return done()
          pulls = pulls.concat(JSON.parse(body))
          let headers = parseGithubHeaders(res.headers.link)
          if (headers && headers.next) q.push(headers.next.url)
          done()
        })
      })
      repos.forEach((repo) => {
        const repoName = (typeof repo === 'string') ? repo : repo.full_name
        q.push(`/repos/${repoName}/pulls?per_page=100`)
      })
      q.drain = function () {
        cb(null, repos)
      }
    }
  }

  return github
}
