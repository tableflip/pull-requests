import express from 'express'
import config from 'config'
import githubOauth from 'github-oauth'
import promisify from 'promisify-node'
import root from './root'
import githubInterface from './github-interface/github'
import ddpServer from './ddp-server'

const github = githubInterface()
promisify(github)
const app = express()
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

ddpServer(server, github)
