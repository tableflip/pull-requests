import express from 'express'
import config from 'config'
import githubOauth from 'github-oauth'
import graphQLServer from './graphql-server'
import root from './root'
import githubInterface from './github-interface/github'

const github = githubInterface()
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

graphQLServer(app, github)

const server = app.listen(config.port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server running at: http://${host}:${port} env: ${process.env.NODE_ENV}`)
})
