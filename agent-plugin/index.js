const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Agent extends RPC {
  constructor(options = {}) {
    options.discoverable = false
    super(options)
    this.descriptions = new Set()
  }

  bindEventListeners() {
    super.bindEventListeners()
    this.environment.on('module.Service', module =>
      this.handleServiceModule(module),
    )
  }

  handleReady() {
    super.handleReady()
    Object.keys(this.environment.modulesByLabel).forEach(name => {
      const modules = this.environment.modulesByLabel[name]
      modules.forEach(module => {
        if (module.name !== 'Service') return
        this.descriptions.add(module.remoteDescription)
      })
    })
  }

  handleServiceModule(module) {
    this.descriptions.add(module.remoteDescription)
  }

  add(description) {
    this.descriptions.add(description)
  }

  handleIncomingConnection() {}

  handleOutgoingConnection(connection) {
    if (connection.incoming) return
    super.handleOutgoingConnection(connection)
  }

  handleRemote(remote) {
    super.handleRemote(remote)
    this.descriptions.forEach(description => {
      this.debug(
        'deploy %s %s to %s',
        description.id,
        description.hash,
        remote.$nodeId,
      )
      remote.deploy(description)
    })
  }
}
