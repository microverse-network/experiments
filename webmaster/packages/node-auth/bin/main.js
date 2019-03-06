#!/usr/bin/env node

require('babel-polyfill')

const debug = require('debug')('webmaster:auth:main')
const argv = require('yargs').options({
  id: {
    demandOption: true,
    describe: 'node id',
    type: 'string',
  },
  port: {
    demandOption: true,
    describe: 'port',
    type: 'number',
  },
  'node-port': {
    demandOption: true,
    describe: 'node port',
    type: 'number',
  },
  'node-url': {
    demandOption: true,
    describe: 'node URL',
    type: 'string',
  },
  'bootstrap-url': {
    demandOption: true,
    describe: 'bootstrap URL',
    type: 'string',
  },
}).argv

debug('argv = %O', argv)

const { Server } = require('../lib')
new Server(argv)
