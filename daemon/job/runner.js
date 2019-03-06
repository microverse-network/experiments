const RPC = require('@microverse-network/core/module/rpc')

const { NodeVM } = require('vm2')

module.exports = class Job extends RPC {
  getProtocol(methods = {}) {
    return super.getProtocol(
      Object.assign(methods, {
        runScript(script) {
          const vm = new NodeVM({ console: 'off' })
          return vm.run(script)()
        },
      }),
    )
  }
}
