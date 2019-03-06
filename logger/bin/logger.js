#!/usr/bin/env node

require('@microverse-network/core/node')
require('@microverse-network/core/plugins-standard')

const config = require('@microverse-network/core/config')
config.logger = false

const Module = require('../index')
global.module = new Module()
