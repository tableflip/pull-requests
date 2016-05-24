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
    request(params, (err, res, body) => {
      if (err) return cb(err)
      if (res.statusCode !== 200) return cb(res.statusCode, body)
      cb(null, JSON.parse(body))
    })
  }

  function makeRepoRequest (url, cb) {
    githubCall({
      method: 'GET',
      url: url
    }, cb)
  }

  var github = {
    setToken (newToken) {
      token = newToken
    },
    getRepos (cb) {
      if (!cb) throw new Error('Please supply a callback function')
      let repos = []
      let q = async.queue(function (url, done) {
        makeRepoRequest(url, function (err, res) {
          if (err) return cb(err)
          if (!res) return done()
          repos = repos.concat(res.data)
          let headers = parseGithubHeaders(res.headers.link)
          if (headers.next) q.push(headers.next.url)
          done()
        })
      })
      q.push(`${baseUrl}/user/repos?per_page=100`)
      q.drain = function () {
        cb(null, repos)
      }
    }
  }

  return github
}
