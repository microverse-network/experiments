const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Logger extends RPC {
  constructor(options = {}) {
    options.discoverable = false
    super(options)
    this.cache = new Set()
  }

  send(level, label, args) {
    const timestamp = Date.now()
    const nodeId = this.node.id
    const message = { timestamp, nodeId, level, label, args }
    this.cache.add(message)
    this.remotes.forEach(remote => remote.log(message))
  }

  handleIncomingConnection() {}

  handleOutgoingConnection(connection) {
    if (connection.incoming) return
    super.handleOutgoingConnection(connection)
  }

  handleRemote(remote) {
    super.handleRemote(remote)
    this.cache.forEach(message => remote.log(message))
  }
}
