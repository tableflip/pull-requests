import express from 'express'
import config from 'config'
import githubOauth from 'github-oauth'
import root from './root'

const app = express()
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send(root())
})
app.get('/login-error', (req, res) => {
  res.send('There was a login error')
})

const github = githubOauth({
  githubClient: config.github.client,
  githubSecret: config.github.secret,
  baseURL: config.rootUrl,
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'user'
})
github.addRoutes(app, (err, token, res) => {
  if (err) {
    console.error(err)
    res.redirect('/login-error')
  }
  console.log(token)
  res.redirect('/')
})

const server = app.listen(config.port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server running at: http://${host}:${port} env: ${process.env.NODE_ENV}`)
})
