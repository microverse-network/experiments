const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Daemon extends RPC {
  getProtocol(methods = {}) {
    return super.getProtocol(Object.assign(methods, {}))
  }
}
