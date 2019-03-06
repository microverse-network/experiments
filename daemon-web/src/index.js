require('@microverse-network/core/browser')
require('@microverse-network/core/plugins-standard')

const Cluster = require('./cluster')

const [scope, alias] = global.location.hash.slice(1).split('/')

if (scope === 'cluster') {
  global.cluster = new Cluster({ alias })
}
