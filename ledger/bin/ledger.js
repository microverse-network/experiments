#!/usr/bin/env node

const commander = require('commander')

const pkg = require('../package.json')

const Module = require('../index')

const program = commander
  .version(pkg.version)
  .description(pkg.description)
  .option('--port <port>', 'port', Number)
  .option('--url <url>', 'URL')
  .parse(process.argv)

const { port, url } = program

require('@microverse-network/core/node')
require('@microverse-network/core/plugins-standard')

const config = require('@microverse-network/core/config')
config.network.transport.options.websocket.options = { port, url }

global.module = new Module()

process.on('unhandledRejection', err => {
  throw err
})
