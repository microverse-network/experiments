const debug = require('debug')('webmaster:web:app')
const express = require('express')
const bodyParser = require('body-parser')

const setBootstrapConfig = require('./setBootstrapConfig')

module.exports = (options, node) => {
  const app = express()
  app.use(express.urlencoded())
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.node = node
    next()
  })

  const siteDomainRegexp = new RegExp(`.${options.siteDomain}$`)

  app.use(async (req, res) => {
    let { host } = req.headers
    if (host.match(siteDomainRegexp)) {
      host = host.replace(siteDomainRegexp, '')
    }
    const labels = host.split('.').reverse()
    const [applicationId, deploymentId] = labels
    const path = req.path.substring(1) || 'index.html'
    const query = { applicationId, path }
    if (deploymentId) {
      query.deploymentId = deploymentId
    }
    const result = await req.node.db.get('repository').find(query)
    if (!result.length) {
      return res.status(404).send()
    }
    const [file] = result.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
    if (file.name === 'index.html') {
      const application = await req.node.db
        .get('applications')
        .findOne({ _id: applicationId })
      setBootstrapConfig(application.bootstrap, file)
    }
    res.type(file.mimetype)
    res.send(file.content)
  })

  node.once('bootstrapped', () => {
    node.db.get('applications')
    node.db.get('deployments')
    node.db.get('repository')
    app.listen(options.port, () => {
      debug('listening on %s', options.port)
    })
  })

  return app
}
