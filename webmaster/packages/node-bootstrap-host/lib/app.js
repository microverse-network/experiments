const debug = require('debug')('webmaster:bootstrap-host:app')
const express = require('express')
const bodyParser = require('body-parser')
const getPort = require('get-port')
const WebSocketDaemon = require('microverse-core/lib/transports/websocket/daemon')
const BootstrapNodeServer = require('microverse-node-bootstrap/lib/server')

let siteDomain = ''

const bootstrapNodes = {}

module.exports = (options, node) => {
  siteDomain = options.siteDomain

  const app = express()
  app.use(express.urlencoded())
  app.use(bodyParser.json())
  app.use((req, res, next) => {
    req.node = node
    next()
  })

  node.db.get('applications')
  node.db.get('deployments')
  node.once('bootstrapped', () => {
    app.listen(options.port, () => {
      debug('listening on %s', options.port)
    })
  })

  node.db
    .get('applications')
    .on('change', async (applicationId, application) => {
      if (!application) {
        debug('shutting down %s', applicationId)
      } else {
        if (bootstrapNodes[applicationId]) {
          return
        }
        debug('starting bootstrap node %s', applicationId)
        const options = {
          node: await getNodeOptions(application),
          signal: await getSignalOptions(application),
        }
        bootstrapNodes[applicationId] = startBootstrapNodeServer(options)
        const $set = {
          bootstrap: {
            node: {
              port: options.node.transport.server.options.port,
              url: options.node.transport.url,
            },
            signal: {
              host: siteDomain,
              port: options.signal.server.address().port,
            },
          },
        }
        await node.db
          .get('applications')
          .update({ _id: applicationId }, { $set })
      }
    })

  return app
}

const startBootstrapNodeServer = async ({ node, signal }) =>
  BootstrapNodeServer({ node, signal })

const getNodeOptions = async application => {
  const port = await getPort()
  return {
    id: 'bootstrap',
    transport: new WebSocketDaemon({
      id: 'bootstrap',
      port: port,
      url: `ws://${siteDomain}:${port}`,
    }),
  }
}

const getSignalOptions = async application => {
  const port = await getPort()
  const app = express()
  const server = app.listen(port)
  return { app, server }
}
