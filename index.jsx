import express from 'express'
import config from 'config'
import root from './root'

const app = express()
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.send(root())
})

const server = app.listen(config.port, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Server running at: http://${host}:${port} env: ${process.env.NODE_ENV}`)
})
