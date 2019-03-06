#!/usr/bin/env node

require('@microverse-network/core/node')
require('@microverse-network/core/plugins-standard')

const Dummy = require('../index')
global.module = new Dummy()
