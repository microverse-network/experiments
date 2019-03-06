const AppendOnly = require('append-only')

const Module = require('@microverse-network/core/module')

module.exports = class LogViewer extends Module {
  constructor(options = {}) {
    options.streamName = 'logger'
    super(options)
    this.list = new AppendOnly()
  }

  bindEventListeners() {
    super.bindEventListeners()
    this.list.on('item', message => {
      this.debug('log message %o', message)
    })
  }

  debug(...args) {
    this._debug(...args)
  }

  bindStreamHandlers() {
    super.bindStreamHandlers()
    this.on('stream.list', stream => this.bindListStream(stream))
  }

  bindListStream(stream) {
    stream.pipe(this.list.createStream()).pipe(stream)
  }
}
