const RPC = require('@microverse-network/core/module/rpc')

const Job = require('../job')

module.exports = class Cluster extends RPC {
  constructor(options = {}) {
    options.id = options.alias
    options.name = Cluster.name
    super(options)
  }

  getProtocol(methods = {}) {
    return super.getProtocol(
      Object.assign(methods, {
        run(id) {
          new Job({ id })
        },
      }),
    )
  }
}
