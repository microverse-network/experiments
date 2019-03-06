const Module = require('@microverse-network/core/module')
const AppendOnly = require('append-only')

const debug = require('debug')('microverse-ledger')

module.exports = class Ledger extends Module {
  constructor(options = {}) {
    super(options)
    this.store = new AppendOnly()
  }

  bindEventListeners() {
    super.bindEventListeners()
    this.store.on('item', item => {
      if (item.receiver === this.network.id) return
      this.handleEntry(item)
    })
  }

  handleEntry(entry) {
    this.emit('entry', entry)
  }

  createStreams(mux) {
    super.createStreams()
    this.bindLedgerStream(mux.createStream('ledger'))
  }

  bindStreamHandlers() {
    super.bindStreamHandlers()
    this.on('stream.ledger', stream => this.bindLedgerStream(stream))
  }

  bindLedgerStream(stream) {
    stream.pipe(this.store.createStream()).pipe(stream)
  }

  push(receiver, payload = {}) {
    const sender = this.network.id
    const entry = { sender, receiver, payload }
    debug('push %o', entry)
    this.store.push(entry)
  }
}
