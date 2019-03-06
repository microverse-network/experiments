const EventEmitter = require('eventemitter3')
const Stripe = require('stripe')

const App = require('./app')
const Peer = require('./peer')

module.exports = class Server extends EventEmitter {
  constructor(options) {
    super()
    this.node = new Peer(options)
    this.stripe = Stripe(options['stripe-secret-key'])
    this.app = App(options, this.node, this.stripe)
  }
}
