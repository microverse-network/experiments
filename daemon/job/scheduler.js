const fs = require('fs')

const uuidv4 = require('uuid/v4')

const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Job extends RPC {
  constructor(options = {}) {
    options.id = uuidv4()
    super(options)
    this.scriptFile = fs.readFileSync(this.options.script).toString()
  }

  async handleRemote(remote) {
    super.handleRemote(remote)
    if (this.scriptFile) {
      const rValue = await remote.runScript(this.scriptFile)
      this.debug('%s => %o', remote.$nodeId, rValue)
      this.emit('remote_done')
    }
  }
}
