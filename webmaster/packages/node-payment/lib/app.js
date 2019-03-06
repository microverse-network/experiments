const debug = require('debug')('webmaster:payment:app')
const express = require('express')
const bodyParser = require('body-parser')

module.exports = (options, node, stripe) => {
  const app = express()
  app.use(express.urlencoded())
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.node = node
    next()
  })

  app.use((req, res, next) => {
    req.stripe = stripe
    next()
  })

  app.use('/customer', require('./middlewares/customer'))

  node.once('bootstrapped', () => {
    node.db.get('users')
    node.db.get('sessions')
    node.db.get('customers')
    app.listen(options.port, () => {
      debug('listening on %s', options.port)
    })
  })

  return app
}
