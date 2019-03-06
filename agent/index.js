const RPC = require('@microverse-network/core/module/rpc')

const Worker = require('./worker')

module.exports = class Agent extends RPC {
  constructor(options = {}) {
    super(options)
    this.workers = new Map()
  }

  async deploy(description) {
    const { id } = description
    if (this.workers.get(id)) return
    this.debug(`deploy %s %s`, description.id, description.hash)
    const worker = new Worker(description)
    this.workers.set(id, worker)
  }

  getProtocol(methods = {}) {
    methods.deploy = (...args) => this.deploy(...args)
    return super.getProtocol(methods)
  }
}
