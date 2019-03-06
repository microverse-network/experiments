const request = require('request-promise-native')
const { NodeVM } = require('vm2')

const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Worker extends RPC {
  constructor(options = {}) {
    super(options)
    this.run()
  }

  async run() {
    const { url } = this.options
    const body = await request(url)
    this.vm = new NodeVM({
      console: 'inherit',
      sandbox: {},
      require: {},
    })

    const { id } = this
    this.handler = this.vm.run(`;${body};module.exports = this["${id}"]`)
  }

  async execute(call) {
    this.debug(`execute(%o)`, call)
    const method = this.handler[call.method || 'default']
    const { args, resolve, reject } = call
    method(...args)
      .then(resolve)
      .catch(reject)
  }

  getProtocol(methods = {}) {
    methods.execute = this.execute.bind(this)
    return super.getProtocol(methods)
  }
}
