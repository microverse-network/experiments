const RPC = require('@microverse-network/core/module/rpc')

const Authentication = require('@microverse-network/core/authentication')

const { argv } = require('yargs')

module.exports = class Dummy extends RPC {
  constructor(options = {}) {
    options.authentication = new Authentication({
      authority: argv.authority,
      code: '123',
    })
    super(options)
  }
}
