const debug = require('debug')('webmaster:deploy:app')
const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

module.exports = (options, node) => {
  const app = express()
  app.use(express.urlencoded())
  app.use(bodyParser.json())
  app.use(fileUpload())
  app.use((req, res, next) => {
    req.node = node
    next()
  })
  app.use('/application', require('./middlewares/application'))
  app.use('/deploy', require('./middlewares/deploy'))

  node.once('bootstrapped', () => {
    node.db.get('users')
    node.db.get('sessions')
    node.db.get('applications')
    node.db.get('deployments')
    node.db.get('repository')
    app.listen(options.port, () => {
      debug('listening on %s', options.port)
    })
  })

  return app
}
