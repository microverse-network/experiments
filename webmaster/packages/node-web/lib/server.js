const EventEmitter = require('eventemitter3')

const App = require('./app')
const Peer = require('./peer')

module.exports = class Server extends EventEmitter {
  constructor(options) {
    super()
    this.node = new Peer(options)
    this.app = App(options, this.node)
  }
}
