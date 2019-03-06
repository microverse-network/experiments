const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Job extends RPC {
  getProtocol(methods = {}) {
    return super.getProtocol(
      Object.assign(methods, {
        runScript(script) {
          return eval(script)() // eslint-disable-line
        },
      }),
    )
  }
}
