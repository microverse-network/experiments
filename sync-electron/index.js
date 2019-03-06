require('@microverse-network/core/electron')
require('@microverse-network/core/plugins-standard')

require('@microverse-network/sync/init')()
const Sync = require('@microverse-network/sync/module')
global.sync = new Sync({ path: '.' })
