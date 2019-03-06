#!/usr/bin/env node

require('@microverse-network/core/node')
require('@microverse-network/core/plugins-standard')

const Sync = require('@microverse-network/sync')

const { argv } = require('yargs')

if (argv.add) {
  require('./add')
} else if (argv.share) {
  require('./share')
} else if (argv.join) {
  require('./join')
} else {
  const { id, key } = argv
  const metadata = { id, key }
  global.sync = new Sync({ metadata })
}
