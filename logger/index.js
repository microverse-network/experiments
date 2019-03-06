const AppendOnly = require('append-only')

const RPC = require('@microverse-network/core/module/rpc')

module.exports = class Logger extends RPC {
  constructor(options = {}) {
    super(options)
    this.list = new AppendOnly()
  }

  createStreams(mux) {
    super.createStreams()
    this.bindListStream(mux.createStream('list'))
  }

  bindStreamHandlers() {
    super.bindStreamHandlers()
    this.on('stream.list', stream => this.bindListStream(stream))
  }

  bindListStream(stream) {
    stream.pipe(this.list.createStream()).pipe(stream)
  }

  log(payload) {
    this.list.push(payload)
  }

  getProtocol(methods = {}) {
    methods.log = (...args) => this.log(...args)
    return super.getProtocol(methods)
  }
}
