import express from 'express'
import config from 'config'
import githubOauth from 'github-oauth'
import promisify from 'promisify-node'
import DDPServer from 'ddp-server-reactive'
// import graphQLServer from './graphql-server'
import root from './root'
import githubInterface from './github-interface/github'

const github = githubInterface()
promisify(github)
const app = express()
// graphQLServer(app, github)
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(root())
})
app.get('/login-error', (req, res) => {
  res.send('There was a login error')
})

const go = githubOauth({
  githubClient: config.github.client,
  githubSecret: config.github.secret,
  baseURL: `${config.host}:${config.port}`,
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'repo'
})

go.addRoutes(app, (err, token, res) => {
  if (err) {
    console.error(err)
    return res.redirect('/login-error')
  }
  github.setToken(token.access_token)
  res.redirect('/')
})

const server = app.listen(config.port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server running at: http://${host}:${port} env: ${process.env.NODE_ENV}`)
})

const ddpServer = new DDPServer({ httpServer: server })

var users = ddpServer.publish('users')
users[0] = { name: 'Richard' }
