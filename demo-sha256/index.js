const crypto = require('crypto')

const RPC = require('@microverse-network/core/module/rpc')
const Database = require('@microverse-network/database')

module.exports = class DemoSHA256 extends RPC {
  constructor(options = {}) {
    super(options)
    this.db = new Database({ id: 'demo-sha256' })
  }

  // bindEventListeners() {
  //   super.bindEventListeners()
  //   this.db.get('sha256').on('change', (key, value) => {
  //     console.log(JSON.stringify(value, null, 2))
  //   })
  // }

  handleRemote(remote) {
    super.handleRemote(remote)
    this.start(remote)
  }

  async start(remote) {
    this.debug('start = %s', new Date())
    for (let i = 0; i < 1000; i++) {
      const data = crypto.randomBytes(1024).toString('base64')
      await this.sha256(data)
      await remote.sha256(data)
    }
    this.debug('end = %s', new Date())
  }

  async sha256(data = '', encoding = 'hex') {
    const nodeId = this.network.id
    const hash = crypto.createHash('sha256')
    hash.update(data)
    const digest = hash.digest(encoding)
    await this.db.get('sha256').insert({ nodeId, data, digest })
  }

  getProtocol(methods = {}) {
    methods.sha256 = (...args) => this.sha256(...args)
    return super.getProtocol(methods)
  }
}
