const debug = require('debug')('webmaster:auth:app')
const express = require('express')
const bodyParser = require('body-parser')

module.exports = (options, node) => {
  const app = express()
  app.use(express.urlencoded())
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.node = node
    next()
  })
  app.post('/login', require('./handlers/login'))
  app.get('/session/:id', require('./handlers/session'))
  app.post('/register', require('./handlers/register'))

  node.once('bootstrapped', () => {
    node.db.get('users')
    node.db.get('sessions')
    app.listen(options.port, () => {
      debug('listening on %s', options.port)
    })
  })

  return app
}
