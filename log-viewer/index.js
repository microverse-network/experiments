require('@microverse-network/core/browser')
require('@microverse-network/core/plugins-standard')

const Module = require('./module')
global.module = new Module()
